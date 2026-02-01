"use server";

import { db } from "@/lib/db";
import { creditTransaction, user } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/guards";
import { eq, sql } from "drizzle-orm";
import { maybeRenewFreeCredits } from "@/lib/credits";

export async function useCredits(
  amount: number,
  type: string,
  description?: string
): Promise<{ success: true } | { error: "insufficient_credits" | "unauthenticated" }> {
  const session = await requireAuth();
  const userId = session.user.id;

  // Lazy renewal for free plan before checking balance
  await maybeRenewFreeCredits(
    userId,
    session.user.plan,
    session.user.creditsResetAt ?? null,
  );

  // Atomic decrement: only succeeds if credits >= amount
  const result = await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(user)
      .set({
        credits: sql`${user.credits} - ${amount}`,
        updatedAt: new Date(),
      })
      .where(
        sql`${user.id} = ${userId} AND ${user.credits} >= ${amount}`,
      )
      .returning({ credits: user.credits });

    if (!updated) return { error: "insufficient_credits" as const };

    await tx.insert(creditTransaction).values({
      id: crypto.randomUUID(),
      userId,
      amount: -amount,
      type,
      description: description ?? null,
    });

    return { success: true as const };
  });

  return result;
}

export async function grantCredits(
  userId: string,
  amount: number,
  type: string,
  description?: string
) {
  await db.transaction(async (tx) => {
    await tx
      .update(user)
      .set({
        credits: sql`${user.credits} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    await tx.insert(creditTransaction).values({
      id: crypto.randomUUID(),
      userId,
      amount,
      type,
      description: description ?? null,
    });
  });
}
