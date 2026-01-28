# Architecture Guide

This document explains the architecture and code organization conventions for this Next.js SaaS boilerplate.

## Core Principle: Colocation

**Code specific to a route lives IN that route. Code shared across routes lives in `/shared`.**

This principle maximizes developer velocity by:
- Reducing navigation between folders
- Making features easy to understand (everything in one place)
- Simplifying deletion (just remove the folder)
- Scaling naturally (move to `/shared` when you reuse code)

---

## Directory Structure

```
src/
├── app/                          Next.js App Router
│   ├── (public)/                 Public pages (no auth)
│   ├── (app)/                    Authenticated client area
│   └── admin/                    Admin-only area
│
├── shared/                       Code reused across multiple routes
│   ├── actions/                  Server Actions (mutations)
│   ├── components/               Reusable components
│   ├── hooks/                    Custom React hooks
│   └── utils/                    Business logic utilities
│
├── lib/                          Technical infrastructure
│   ├── db/                       Database (Drizzle ORM)
│   ├── auth/                     Authentication (Better Auth)
│   └── utils.ts                  Generic utilities (cn, etc.)
│
└── components/                   Legacy alias (will be migrated to shared/)
```

---

## The Three Locations

### 1. Route-Specific Code (`app/[route]/`)

Code used by **ONE route only**.

```
app/admin/dashboard/
  ├── page.tsx              Route component (Server Component)
  ├── data.ts               Server-side queries ("use server" + cache())
  ├── actions.ts            Server Actions used ONLY in this route
  ├── loading.tsx           Loading boundary
  ├── error.tsx             Error boundary
  └── _components/          Components used ONLY in this route
      ├── plan-chart.tsx
      └── user-list.tsx
```

**Rules:**
- Start here by default
- Move to `/shared` only when you reuse code in a second route
- Prefix with `_` for private folders (Next.js convention)

---

### 2. Shared Code (`shared/`)

Code reused across **2+ routes**.

```
shared/
  ├── actions/              Server Actions (mutations)
  │   ├── users.ts          createUser, updateUser, deleteUser
  │   └── credits.ts        grantCredits, deductCredits
  │
  ├── components/           Reusable components
  │   ├── ui/               shadcn/ui components
  │   ├── landing/          Landing page components
  │   └── credit-badge.tsx  Business components
  │
  ├── hooks/                Custom React hooks
  │   └── use-credits.ts
  │
  └── utils/                Business logic utilities
      └── credits.ts        formatCredits, calculateTotal
```

**Rules:**
- Only put code here when used by 2+ routes
- Organize by type (actions, components, hooks, utils)
- Keep it flat (avoid deep nesting)

---

### 3. Infrastructure (`lib/`)

Technical infrastructure not specific to your business.

```
lib/
  ├── db/                   Database
  │   ├── index.ts          Drizzle client
  │   └── schema/           Table schemas
  │
  ├── auth/                 Authentication
  │   ├── auth.ts           Better Auth config
  │   ├── guards.ts         requireAuth, requireRole
  │   └── types.ts          Session types
  │
  ├── email.ts              Resend integration
  ├── s3.ts                 S3 upload
  └── utils.ts              Generic utils (cn, clsx)
```

**Rules:**
- Only infrastructure code (DB, Auth, External services)
- Could be copy-pasted to another Next.js project
- No business logic

---

## Decision Tree

```
┌─────────────────────────────────────────────────────┐
│ Where should I put this code?                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 1. Is it used in ONE route only?                   │
│    YES → app/[route]/                              │
│    NO → Continue                                   │
│                                                     │
│ 2. Is it technical infrastructure?                 │
│    (DB, Auth, External services, Config)           │
│    YES → lib/                                      │
│    NO → Continue                                   │
│                                                     │
│ 3. Is it business code used by 2+ routes?          │
│    YES → shared/                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## File Types & Naming

### Server-Side Files

#### `data.ts` - Queries (Read operations)
```typescript
// app/admin/dashboard/data.ts
"use server";
import { cache } from "react";

export const getTotalUsers = cache(async (): Promise<number> => {
  const result = await db.select({ count: count() }).from(user);
  return result[0]?.count ?? 0;
});
```

**When:**
- Server-side data fetching
- Called from Server Components
- Read-only operations (GET)

**Naming:**
- File: `data.ts` (in route folder)
- Functions: `getX`, `fetchX`, `loadX`
- Always use `cache()` for deduplication

---

#### `actions.ts` - Server Actions (Write operations)
```typescript
// shared/actions/credits.ts
"use server";

export async function grantCredits(userId: string, amount: number) {
  await requireRole("admin");

  await db.insert(creditTransaction).values({
    userId,
    amount,
    type: "admin_grant",
  });

  revalidatePath("/admin/dashboard");
}
```

**When:**
- Mutations (POST, PUT, DELETE)
- Called from Client Components (forms, buttons)
- Need revalidation or redirect

**Naming:**
- File: `actions.ts` (local) or `shared/actions/[domain].ts` (shared)
- Functions: Verb form (`grantCredits`, `deleteUser`, `updatePlan`)

---

### Component Files

#### Private Components (`_components/`)
```typescript
// app/admin/dashboard/_components/plan-chart.tsx
import { Card } from "@/shared/components/ui/card";

export function PlanChart({ data }: { data: PlanData[] }) {
  return <Card>...</Card>;
}
```

**When:**
- Component used ONLY in one route
- Complex UI that deserves its own file

**Naming:**
- Folder: `_components/` (underscore prefix)
- Files: `kebab-case.tsx`
- Components: `PascalCase`

---

#### Shared Components
```typescript
// shared/components/credit-badge.tsx
export function CreditBadge({ credits }: { credits: number }) {
  return <Badge variant={credits > 0 ? "success" : "destructive"}>{credits}</Badge>;
}
```

**When:**
- Component used in 2+ routes
- Reusable UI elements

**Naming:**
- Path: `shared/components/[name].tsx`
- Organize by domain if many: `shared/components/credits/badge.tsx`

---

## Examples

### Example 1: Admin Dashboard (Route-specific)

```
app/admin/dashboard/
  ├── page.tsx                      Entry point
  ├── data.ts                       Queries (getTotalUsers, getActiveUsers)
  ├── loading.tsx                   Loading state
  ├── error.tsx                     Error boundary
  └── _components/                  Private components
      ├── stats-cards.tsx
      ├── plan-distribution-chart.tsx
      ├── user-growth-chart.tsx
      └── recent-users-list.tsx
```

**Why this structure:**
- Everything is in one place
- Easy to understand the feature
- No navigation between folders
- Can delete entire feature by removing the folder

---

### Example 2: Credit System (Shared)

```
shared/
  ├── actions/
  │   └── credits.ts                grantCredits, deductCredits
  │
  ├── components/
  │   └── credit-badge.tsx          Badge UI
  │
  ├── hooks/
  │   └── use-credits.ts            Client-side credit state
  │
  └── utils/
      └── credits.ts                formatCredits, calculateTotal
```

**Why shared:**
- Used in admin dashboard, user profile, feature pages
- Reusable across multiple routes
- Single source of truth for credit logic

---

### Example 3: Landing Page (Shared components)

```
shared/components/landing/
  ├── nav.tsx                       Navigation bar
  ├── footer.tsx                    Footer
  ├── hero.tsx                      Hero section
  └── pricing.tsx                   Pricing section
```

**Why shared:**
- Nav/footer used on all public pages
- Hero/pricing may be reused in different contexts
- Organized by domain (landing)

---

## Migration Path

### Starting New Feature

1. **Start in the route folder**
```
app/new-feature/
  ├── page.tsx
  └── _components/
      └── my-component.tsx
```

2. **Move to shared when you reuse**
```
// Second route needs my-component.tsx
shared/components/
  └── my-component.tsx        Moved here
```

3. **Keep route-specific code local**
```
app/new-feature/
  ├── page.tsx
  ├── data.ts                 Still here (only this route uses it)
  └── _components/
      └── other-component.tsx Still here (only this route uses it)
```

---

## Anti-Patterns

### ❌ Don't: Create shared code prematurely
```
shared/components/dashboard/
  └── plan-chart.tsx          Only used in ONE route
```

**Why bad:** Over-engineering. Start in the route folder.

---

### ❌ Don't: Mix infrastructure and business in lib
```
lib/
  ├── db/                     Infrastructure ✅
  └── credits.ts              Business logic ❌
```

**Why bad:** `lib/` is for infrastructure. Business logic goes in `shared/`.

---

### ❌ Don't: Nest too deeply
```
shared/components/features/admin/dashboard/charts/
  └── plan-distribution.tsx
```

**Why bad:** Over-organization. Keep it flat:
```
shared/components/plan-distribution-chart.tsx
```

---

### ❌ Don't: Use barrel exports (index.ts) everywhere
```
shared/components/index.ts   Avoid this
export * from './button'
export * from './card'
```

**Why bad:**
- Slows down build (Next.js has to parse everything)
- Makes tree-shaking harder
- Import directly instead: `import { Button } from '@/shared/components/ui/button'`

**Exception:** OK for `ui/` components where you import many at once.

---

## Path Aliases

Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

**Usage:**
```typescript
// ✅ Good
import { grantCredits } from "@/shared/actions/credits"
import { db } from "@/lib/db"
import { Button } from "@/shared/components/ui/button"

// ❌ Avoid relative imports across folders
import { grantCredits } from "../../../shared/actions/credits"
```

---

## FAQ

### Q: What if I'm not sure if code will be reused?

**Start local.** It's easier to move code to `/shared` later than to organize prematurely.

```
1. Create in route folder
2. Use it
3. Need it in second route? → Move to /shared
```

---

### Q: Where do Server Actions go?

**Depends:**
- Used in 1 route → `app/[route]/actions.ts`
- Used in 2+ routes → `shared/actions/[domain].ts`

**Start local, move when you reuse.**

---

### Q: Where does shadcn/ui go?

`shared/components/ui/`

These are reusable UI primitives used everywhere.

---

### Q: Can I have nested routes in `_components`?

**Avoid it.** Keep components flat:

```
// ❌ Too nested
_components/
  └── charts/
      └── plan-distribution/
          └── index.tsx

// ✅ Better
_components/
  └── plan-distribution-chart.tsx
```

---

### Q: What about types?

**Colocate with usage:**

```typescript
// app/admin/dashboard/data.ts
export type DashboardStats = {
  totalUsers: number;
  activeUsers: number;
};

export const getStats = cache(async (): Promise<DashboardStats> => {
  // ...
});
```

**If shared:**
```typescript
// shared/types/credits.ts
export type CreditTransaction = {
  id: string;
  amount: number;
  type: string;
};
```

---

## Summary

1. **Start in the route folder** - Default location for new code
2. **Move to `/shared` when you reuse** - Don't over-engineer upfront
3. **Keep `/lib` for infrastructure only** - DB, Auth, External services
4. **Use the decision tree** - When in doubt, follow the flowchart
5. **Keep it flat** - Avoid deep nesting
6. **Colocate related code** - Less navigation = faster development

**Remember:** This structure prioritizes developer velocity and maintainability over premature optimization.
