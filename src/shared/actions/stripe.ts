"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/guards";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PLANS, type PlanId } from "@/lib/plans";

export async function createCheckoutSession(planId: PlanId) {
  if (!(planId in PLANS)) throw new Error("Invalid plan");

  const session = await requireAuth();
  const plan = PLANS[planId];

  if (!plan.stripePriceId) {
    throw new Error("Cannot checkout for free plan");
  }

  try {
    // Ensure user has a Stripe customer ID
    let stripeCustomerId = session.user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: { userId: session.user.id },
      });
      stripeCustomerId = customer.id;

      await db
        .update(userTable)
        .set({ stripeCustomerId, updatedAt: new Date() })
        .where(eq(userTable.id, session.user.id));
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      metadata: { userId: session.user.id, planId },
      success_url: `${appUrl}/plans?success=true`,
      cancel_url: `${appUrl}/plans?canceled=true`,
    });

    redirect(checkoutSession.url!);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Stripe checkout failed:", error);
    throw new Error("Payment setup failed. Please try again.");
  }
}

export async function createBillingPortalSession() {
  const session = await requireAuth();

  if (!session.user.stripeCustomerId) {
    throw new Error("No Stripe customer found");
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: session.user.stripeCustomerId,
      return_url: `${appUrl}/plans`,
    });

    redirect(portalSession.url);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Stripe billing portal failed:", error);
    throw new Error("Unable to open billing portal. Please try again.");
  }
}
