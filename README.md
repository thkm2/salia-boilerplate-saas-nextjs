# SaaS Boilerplate

La boilerplate Next.js avec tout ce dont vous avez besoin pour créer votre SaaS, votre outil d'IA ou toute autre application web.

## Stack Technique

- **Framework** : Next.js 16 (App Router) + React 19
- **UI** : shadcn/ui + Tailwind CSS v4
- **Base de données** : Neon PostgreSQL + Drizzle ORM
- **Authentification** : Better Auth (Google OAuth, Magic Link)
- **Formulaires** : React Hook Form + Zod
- **State** : Server Components first, Zustand/TanStack Query si nécessaire

## Démarrage

```bash
pnpm install
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Architecture

### Zones de l'application

| Zone | Description | Layout |
|------|-------------|--------|
| `(public)` | Pages publiques | Sans auth |
| `(app)` | Espace client | Avec/sans sidebar |
| `(admin)` | Administration | Sidebar admin |

### Auth & Authorization

Séparation claire entre authentification et autorisation :

- **Auth** : Gestion de session (Better Auth)
- **Authorization** : Contrôle d'accès via helpers
  - `requireAuth()` - Vérifie l'authentification
  - `requireRole("admin")` - Vérifie le rôle
  - `canAccessFeature("X")` - Vérifie les feature flags

### Rôles

- `admin` - Accès complet + dashboard admin
- `user` - Utilisateur standard
- `beta` - Accès aux fonctionnalités beta

### Plans & Crédits

Système de crédits transactionnel avec historique complet :

| Plan | Crédits |
|------|---------|
| Free | Limité |
| Basic | Standard |
| Pro | Élevé |
| Admin | Illimité |

Chaque opération crée une transaction (+X ou -X) pour audit.

### Feature Flags

Activation granulaire par utilisateur, gérable depuis le panel admin.

## Structure

```
src/
├── app/                           # Next.js App Router
│   ├── (public)/                  # Pages publiques
│   ├── (app)/                     # Espace authentifié
│   │   ├── (with-sidebar)/
│   │   └── (without-sidebar)/
│   └── admin/
│       └── dashboard/
│           ├── page.tsx           # Route
│           ├── data.ts            # Queries
│           └── _components/       # Components privés
│
├── shared/                        # Code réutilisable
│   ├── actions/                   # Server Actions
│   ├── components/
│   │   ├── ui/                    # shadcn/ui
│   │   └── landing/               # Landing page
│   ├── hooks/                     # Custom hooks
│   └── utils/                     # Utils métier
│
└── lib/                           # Infrastructure
    ├── auth/                      # Better Auth + guards
    ├── db/                        # Drizzle schemas
    └── utils.ts                   # Utils génériques
```

**📖 Voir [md/ARCHITECTURE.md](md/ARCHITECTURE.md) pour le guide complet**

## Principes

- Server Components par défaut
- Server Actions pour les mutations (pas d'API routes)
- Logging minimal : erreurs et événements critiques uniquement
- Gestion d'erreurs fine et contrôlée
