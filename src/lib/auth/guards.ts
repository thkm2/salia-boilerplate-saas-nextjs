import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ExtendedSession } from "./types";
import { db } from "@/lib/db";
import { featureFlag, userFeatureFlag } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Get the current session from Better Auth
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session as ExtendedSession | null;
}

/**
 * Require authentication - throws/redirects if not authenticated
 */
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/auth");
  }

  return session;
}

/**
 * Require a specific role - throws if user doesn't have the role
 */
export async function requireRole(role: "admin" | "user" | "beta") {
  const session = await requireAuth();

  if (session.user.role !== role) {
    // Admin can access everything
    if (session.user.role === "admin") {
      return session;
    }

    throw new Error(`Access denied. Required role: ${role}`);
  }

  return session;
}

/**
 * Check if user can access a feature based on feature flags
 */
export async function canAccessFeature(featureName: string): Promise<boolean> {
  const session = await getSession();

  if (!session) {
    return false;
  }

  // Admin can access all features
  if (session.user.role === "admin") {
    return true;
  }

  const result = await db
    .select({ flagId: userFeatureFlag.flagId })
    .from(userFeatureFlag)
    .innerJoin(featureFlag, eq(userFeatureFlag.flagId, featureFlag.id))
    .where(and(
      eq(userFeatureFlag.userId, session.user.id),
      eq(featureFlag.name, featureName),
      eq(featureFlag.enabled, true),
    ))
    .limit(1);

  return result.length > 0;
}

/**
 * Require feature access - throws if user doesn't have access
 */
export async function requireFeature(featureName: string) {
  const hasAccess = await canAccessFeature(featureName);

  if (!hasAccess) {
    throw new Error(`Access denied. Required feature: ${featureName}`);
  }

  const session = await requireAuth();
  return session;
}

/**
 * Check if user has enough credits
 */
export async function hasEnoughCredits(amount: number): Promise<boolean> {
  const session = await getSession();

  if (!session) {
    return false;
  }

  return session.user.credits >= amount;
}

/**
 * Get current user's plan
 */
export async function getUserPlan(): Promise<"free" | "basic" | "pro" | "admin" | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return session.user.plan;
}
