"use server";

import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/guards";
import { eq } from "drizzle-orm";

export async function deleteAccount(): Promise<{ success: true } | { error: string }> {
  const session = await requireAuth();

  await db.delete(user).where(eq(user.id, session.user.id));

  return { success: true };
}
