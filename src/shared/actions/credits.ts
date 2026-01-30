"use server";

import { db } from "@/lib/db";
import { creditTransaction, user } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/guards";
import { eq, sql } from "drizzle-orm";

export async function useCredits(
  amount: number,
  type: string,
  description?: string
): Promise<{ success: true } | { error: "insufficient_credits" | "unauthenticated" }> {
  const session = await requireAuth();
  const userId = session.user.id;

  if (session.user.credits < amount) {
    return { error: "insufficient_credits" };
  }

  // Atomically decrement credits and create transaction
  const [updated] = await db
    .update(user)
    .set({
      credits: sql`${user.credits} - ${amount}`,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId))
    .returning({ credits: user.credits });

  if (!updated || updated.credits < 0) {
    // Race condition: credits went negative, rollback by adding back
    await db
      .update(user)
      .set({
        credits: sql`${user.credits} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));
    return { error: "insufficient_credits" };
  }

  await db.insert(creditTransaction).values({
    id: crypto.randomUUID(),
    userId,
    amount: -amount,
    type,
    description: description ?? null,
  });

  return { success: true };
}

export async function grantCredits(
  userId: string,
  amount: number,
  type: string,
  description?: string
) {
  await db
    .update(user)
    .set({
      credits: sql`${user.credits} + ${amount}`,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId));

  await db.insert(creditTransaction).values({
    id: crypto.randomUUID(),
    userId,
    amount,
    type,
    description: description ?? null,
  });
}
