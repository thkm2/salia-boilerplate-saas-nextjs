import type { auth } from "./auth";

// Base session type from Better Auth
export type BaseSession = typeof auth.$Infer.Session;

// Extended user type with custom fields
export interface ExtendedUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Custom fields
  role: "admin" | "user" | "beta";
  plan: "free" | "basic" | "pro" | "admin";
  credits: number;
  featureFlags: string; // JSON string
  firstLoginAt?: Date | null;
  lastLoginAt?: Date | null;
}

// Extended session type
export interface ExtendedSession extends Omit<BaseSession, "user"> {
  user: ExtendedUser;
}

// Helper to parse feature flags
export function parseFeatureFlags(featureFlagsStr?: string | null): Record<string, boolean> {
  if (!featureFlagsStr) return {};
  try {
    return JSON.parse(featureFlagsStr);
  } catch {
    return {};
  }
}

// Type guard to check if session has extended fields
export function isExtendedSession(session: BaseSession | null): session is ExtendedSession {
  if (!session) return false;
  return "role" in session.user && "plan" in session.user;
}
