import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { rateLimit } from "@/lib/rate-limit";

const { GET, POST: originalPost } = toNextJsHandler(auth);

const AUTH_RATE_LIMIT = 10; // requests
const AUTH_RATE_WINDOW = 60 * 1000; // 1 minute

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

// Rate limit only POST requests (sign-in attempts)
// GET requests (callbacks, session) are not rate limited
async function POST(request: NextRequest): Promise<Response> {
  const pathname = request.nextUrl.pathname;

  // Only rate limit sign-in routes, not sign-out
  if (pathname.includes("/sign-in/")) {
    const ip = getClientIp(request);
    const { success } = rateLimit(
      `auth:${ip}`,
      AUTH_RATE_LIMIT,
      AUTH_RATE_WINDOW
    );

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  return originalPost(request);
}

export { GET, POST };
