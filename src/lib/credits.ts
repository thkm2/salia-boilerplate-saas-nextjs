import { db } from "@/lib/db";
import { user as userTable, creditTransaction } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { PLANS } from "@/lib/plans";

/**
 * Lazy renewal: resets free plan credits if the current month differs from creditsResetAt.
 * Uses a conditional UPDATE to prevent double-renewal at month boundaries.
 * Returns true if credits were renewed.
 */
export async function maybeRenewFreeCredits(
  userId: string,
  currentPlan: "free" | "basic" | "pro",
  creditsResetAt: Date | null,
): Promise<boolean> {
  if (currentPlan !== "free") return false;

  const now = new Date();
  const nowMonth = now.getUTCFullYear() * 12 + now.getUTCMonth();
  const resetMonth = creditsResetAt
    ? creditsResetAt.getUTCFullYear() * 12 + creditsResetAt.getUTCMonth()
    : -1;

  if (nowMonth === resetMonth) return false;

  // First day of current month UTC — used as the atomic guard
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const renewed = await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(userTable)
      .set({
        credits: PLANS.free.credits,
        creditsResetAt: now,
        updatedAt: now,
      })
      .where(
        sql`${userTable.id} = ${userId} AND (${userTable.creditsResetAt} IS NULL OR ${userTable.creditsResetAt} < ${monthStart})`,
      )
      .returning({ id: userTable.id });

    if (!updated) return false;

    await tx.insert(creditTransaction).values({
      id: crypto.randomUUID(),
      userId,
      amount: PLANS.free.credits,
      type: "free_monthly_renewal",
      description: "Monthly free plan credit renewal",
    });

    return true;
  });

  return renewed;
}
