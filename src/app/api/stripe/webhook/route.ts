import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { user as userTable, creditTransaction } from "@/lib/db/schema";
import { eq, and, ne, lt, or, isNull } from "drizzle-orm";
import { PLANS, planIdFromPriceId, type PlanId } from "@/lib/plans";
import type Stripe from "stripe";

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not set");
}
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId as PlanId | undefined;

      if (!userId || !planId || !PLANS[planId]) break;

      const plan = PLANS[planId];
      const subscriptionId = session.subscription as string;

      await db.transaction(async (tx) => {
        // Idempotency: only update if subscription ID is not already set to this value
        const [updated] = await tx
          .update(userTable)
          .set({
            plan: planId,
            credits: plan.credits,
            stripeSubscriptionId: subscriptionId,
            creditsResetAt: new Date(),
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(userTable.id, userId),
              or(isNull(userTable.stripeSubscriptionId), ne(userTable.stripeSubscriptionId, subscriptionId)),
            ),
          )
          .returning({ id: userTable.id });

        if (!updated) return;

        await tx.insert(creditTransaction).values({
          id: crypto.randomUUID(),
          userId,
          amount: plan.credits,
          type: "subscription_start",
          description: `Subscribed to ${plan.label} plan`,
        });
      });

      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;

      // Skip the first invoice (handled by checkout.session.completed)
      if (invoice.billing_reason === "subscription_create") break;

      const subDetails = invoice.parent?.subscription_details;
      const subscriptionId =
        typeof subDetails?.subscription === "string"
          ? subDetails.subscription
          : subDetails?.subscription?.id;

      if (!subscriptionId) break;

      const [dbUser] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.stripeSubscriptionId, subscriptionId))
        .limit(1);

      if (!dbUser) break;

      const planId = dbUser.plan as PlanId;
      const plan = PLANS[planId];
      if (!plan) break;

      // Idempotency: only reset credits if creditsResetAt is before current billing cycle start
      const periodStart = new Date(
        (invoice.lines.data[0]?.period?.start ?? 0) * 1000,
      );

      await db.transaction(async (tx) => {
        const [updated] = await tx
          .update(userTable)
          .set({
            credits: plan.credits,
            creditsResetAt: new Date(),
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(userTable.id, dbUser.id),
              lt(userTable.creditsResetAt, periodStart),
            ),
          )
          .returning({ id: userTable.id });

        if (!updated) return;

        await tx.insert(creditTransaction).values({
          id: crypto.randomUUID(),
          userId: dbUser.id,
          amount: plan.credits,
          type: "subscription_renewal",
          description: `Monthly renewal — ${plan.label} plan`,
        });
      });

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0]?.price?.id;

      if (!priceId) break;

      const newPlanId = planIdFromPriceId(priceId);
      if (!newPlanId || newPlanId === "free") break;

      const newPlan = PLANS[newPlanId];

      await db.transaction(async (tx) => {
        // Idempotency: only update if plan actually changed
        const [updated] = await tx
          .update(userTable)
          .set({
            plan: newPlanId,
            credits: newPlan.credits,
            creditsResetAt: new Date(),
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(userTable.stripeSubscriptionId, subscription.id),
              ne(userTable.plan, newPlanId),
            ),
          )
          .returning({ id: userTable.id });

        if (!updated) return;

        await tx.insert(creditTransaction).values({
          id: crypto.randomUUID(),
          userId: updated.id,
          amount: newPlan.credits,
          type: "plan_change",
          description: `Plan changed to ${newPlan.label}`,
        });
      });

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      await db.transaction(async (tx) => {
        // Idempotency: only downgrade if user is not already on free plan
        const [updated] = await tx
          .update(userTable)
          .set({
            plan: "free",
            credits: PLANS.free.credits,
            stripeSubscriptionId: null,
            creditsResetAt: new Date(),
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(userTable.stripeSubscriptionId, subscription.id),
              ne(userTable.plan, "free"),
            ),
          )
          .returning({ id: userTable.id });

        if (!updated) return;

        await tx.insert(creditTransaction).values({
          id: crypto.randomUUID(),
          userId: updated.id,
          amount: PLANS.free.credits,
          type: "subscription_canceled",
          description: "Subscription canceled — downgraded to Free",
        });
      });

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subDetails = invoice.parent?.subscription_details;
      const subscriptionId =
        typeof subDetails?.subscription === "string"
          ? subDetails.subscription
          : subDetails?.subscription?.id;

      console.error("Stripe payment failed:", {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        subscriptionId: subscriptionId ?? null,
      });

      break;
    }
  }

  return NextResponse.json({ received: true });
}
