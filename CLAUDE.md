# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server (localhost:3000)
pnpm build        # Production build
pnpm lint         # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Auth**: Better Auth (Google OAuth, Magic Link)
- **Styling**: Tailwind CSS 4 with CSS variables
- **UI**: shadcn/ui (new-york style) with Lucide icons
- **Forms**: React Hook Form + Zod
- **Package Manager**: pnpm

## Architecture Principles

This is a SaaS boilerplate. Follow these patterns:

### Philosophy: Essential Over Overkill
Keep it simple and production-ready. Write the minimum code needed. Optimize only when there's a real performance issue. Three similar lines is better than a premature abstraction.

### Data Flow Priority
1. **Server Components** - Default for all components
2. **Server Actions** - Primary data mutations, avoid API routes
3. **TanStack Query** - Only when client-side cache/sync is required
4. **Zustand** - Only for complex client state that can't be URL/server-driven

### Code Organization

**Core Principle: Colocation**
- Code specific to ONE route → Lives IN that route (`app/[route]/`)
- Code shared across 2+ routes → Lives in `/shared`
- Infrastructure (DB, Auth) → Lives in `/lib`

```
src/
├── app/                           # Next.js App Router
│   ├── (public)/                  # Public pages (no auth)
│   ├── (app)/                     # Authenticated client area
│   └── admin/
│       └── dashboard/
│           ├── page.tsx           # Route component
│           ├── data.ts            # Queries (Server-side reads)
│           ├── actions.ts         # Actions (local mutations)
│           └── _components/       # Private components
│
├── shared/                        # Code reused across routes
│   ├── actions/                   # Server Actions (mutations)
│   ├── components/                # Reusable components
│   │   ├── ui/                    # shadcn/ui components
│   │   └── landing/               # Landing page components
│   ├── hooks/                     # Custom React hooks
│   └── utils/                     # Business logic utilities
│
└── lib/                           # Technical infrastructure
    ├── auth/                      # Better Auth
    │   ├── auth.ts                # Auth config (Google OAuth, Magic Link)
    │   └── guards.ts              # requireAuth(), requireRole()
    ├── db/                        # Drizzle ORM
    │   ├── schema/                # DB schemas
    │   └── index.ts               # DB client
    └── utils.ts                   # Generic utilities (cn, etc.)
```

**Decision Tree:**
1. Used in 1 route? → `app/[route]/`
2. Infrastructure (DB/Auth)? → `lib/`
3. Shared business code? → `shared/`

### Route File Conventions

| File | When to use |
|------|-------------|
| `loading.tsx` | Routes with data fetching (`await` in page). Use `Skeleton` components matching page layout. |
| `_components/` | Route-specific components. Underscore prefix = private (not routable). Kebab-case files, PascalCase exports. |

**📖 For detailed architecture guidelines, see [md/ARCHITECTURE.md](md/ARCHITECTURE.md)**

### Auth vs Authorization Pattern
- **Auth** (`lib/auth/auth.ts`): Who is connected - Better Auth handles session
- **Session**: User data including id, role, plan, feature flags
- **Authorization** (`lib/auth/guards.ts`): Permission checks
  - `requireAuth()` - Throws if not authenticated
  - `requireRole("admin")` - Role-based access
  - `canAccessFeature("featureName")` - Feature flag check

### Roles & Plans
- **Roles**: `admin`, `user`, `beta` (stored in session)
- **Plans**: `free`, `basic`, `pro` - Each with credit allocations

### Credits System
Credits are transactional with full audit trail:
- Each operation creates a transaction record (+X or -X)
- Never direct increment/decrement
- Examples: `upgrade_plan +100`, `feature_use -1`, `admin_grant +500`

### Feature Flags
- Per-user feature activation (beyond simple `beta` role)
- Admin panel for flag management
- Stored in user record, accessible in session

### Logging
No external logging packages. Only log:
- Errors
- Critical security events
Keep error handling precise and controlled.

## Path Aliases

```typescript
@/*               // src/*
@/shared/*        // src/shared/*
@/lib/*           // src/lib/*
```

**Usage:**
```typescript
import { grantCredits } from "@/shared/actions/credits"
import { db } from "@/lib/db"
import { Button } from "@/shared/components/ui/button"
```

## Adding shadcn Components

```bash
pnpm dlx shadcn@latest add [component-name]
```
