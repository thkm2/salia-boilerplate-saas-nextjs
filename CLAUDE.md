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
```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages (no auth)
│   ├── (app)/             # Authenticated client area
│   │   ├── (with-sidebar)/
│   │   └── (without-sidebar)/
│   └── (admin)/           # Admin-only area
├── components/
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── auth/              # Better Auth setup
│   │   ├── auth.ts        # Auth config (Google OAuth, Magic Link)
│   │   └── guards.ts      # requireAuth(), requireRole(), canAccessFeature()
│   ├── db/                # Drizzle ORM
│   │   ├── schema/        # DB schemas
│   │   └── index.ts       # DB client
│   └── utils.ts           # cn() helper
└── hooks/                 # React hooks
```

### Auth vs Authorization Pattern
- **Auth** (`lib/auth/auth.ts`): Who is connected - Better Auth handles session
- **Session**: User data including id, role, plan, feature flags
- **Authorization** (`lib/auth/guards.ts`): Permission checks
  - `requireAuth()` - Throws if not authenticated
  - `requireRole("admin")` - Role-based access
  - `canAccessFeature("featureName")` - Feature flag check

### Roles & Plans
- **Roles**: `admin`, `user`, `beta` (stored in session)
- **Plans**: `free`, `basic`, `pro`, `admin` - Each with credit allocations

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
@/components  // src/components
@/lib         // src/lib
@/hooks       // src/hooks
@/components/ui  // src/components/ui (shadcn)
```

## Adding shadcn Components

```bash
pnpm dlx shadcn@latest add [component-name]
```
