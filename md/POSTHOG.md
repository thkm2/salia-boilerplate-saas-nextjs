# PostHog Integration

## Architecture

```
instrumentation-client.ts          # Client-side init (Next.js hook)
src/lib/posthog.ts                 # Server-side singleton (posthog-node)
src/shared/components/
  posthog-provider.tsx             # React context provider (wraps app)
  posthog-identify.tsx             # User identification component
next.config.ts                     # Rewrites to proxy PostHog via /ingest
```

**How it works:**

1. `instrumentation-client.ts` initializes `posthog-js` on page load via the Next.js instrumentation hook
2. `PostHogProvider` wraps the app in the root layout, passing the already-initialized PostHog instance
3. `PostHogIdentify` is placed in authenticated layouts to call `posthog.identify()` with user properties
4. `next.config.ts` rewrites `/ingest/*` to PostHog servers, bypassing ad-blockers
5. `src/lib/posthog.ts` provides a server-side client for tracking in Server Actions

## Track a Custom Event

### Client-side (React component)

```tsx
"use client";

import { usePostHog } from "posthog-js/react";

function MyComponent() {
  const posthog = usePostHog();

  const handleClick = () => {
    posthog.capture("button_clicked", {
      button_name: "upgrade",
      page: "pricing",
    });
  };

  return <button onClick={handleClick}>Upgrade</button>;
}
```

### Server-side (Server Action / Route Handler)

```ts
"use server";

import { posthog } from "@/lib/posthog";

export async function someAction(userId: string) {
  // ... your logic

  posthog.capture({
    distinctId: userId,
    event: "plan_upgraded",
    properties: {
      plan: "pro",
      source: "settings",
    },
  });
}
```

## Identify a User

User identification happens automatically in authenticated layouts via the `<PostHogIdentify>` component. If you need to identify in a new layout:

```tsx
import { PostHogIdentify } from "@/shared/components/posthog-identify";

// Inside a server component with session access:
<PostHogIdentify
  userId={session.user.id}
  email={session.user.email}
  name={session.user.name}
  role={session.user.role}
  plan={session.user.plan}
/>
```

## Feature Flags

### Client-side

```tsx
"use client";

import { useFeatureFlagEnabled } from "posthog-js/react";

function MyComponent() {
  const showNewFeature = useFeatureFlagEnabled("new-dashboard");

  if (!showNewFeature) return null;
  return <NewDashboard />;
}
```

### Server-side

```ts
import { posthog } from "@/lib/posthog";

const isEnabled = await posthog.isFeatureEnabled("new-dashboard", userId);
```

## Add PostHog to a New Layout

1. Import the provider in `src/app/layout.tsx` (already done at root level)
2. If the layout has session data and needs identification, add `<PostHogIdentify>`:

```tsx
import { PostHogIdentify } from "@/shared/components/posthog-identify";

export default async function NewLayout({ children }) {
  const session = await getSession();

  return (
    <>
      {session && (
        <PostHogIdentify
          userId={session.user.id}
          email={session.user.email}
          name={session.user.name}
          role={session.user.role}
          plan={session.user.plan}
        />
      )}
      {children}
    </>
  );
}
```

## Event Naming Convention

Use `snake_case` for all event names:

| Event | Description |
|-------|-------------|
| `plan_upgraded` | User upgraded their plan |
| `plan_downgraded` | User downgraded their plan |
| `credits_purchased` | User purchased credits |
| `feature_used` | User used a billable feature |
| `onboarding_completed` | User completed onboarding |
| `invite_sent` | User sent a team invite |

Properties should also use `snake_case`:

```ts
posthog.capture("feature_used", {
  feature_name: "ai_generation",
  credits_consumed: 5,
  source: "dashboard",
});
```
