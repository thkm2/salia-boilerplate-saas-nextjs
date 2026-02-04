
[X] - Feature flag crud
[X] - Plans + crédits (conso et affichage)
[X] - Settings/profile
[X] - Landing page
[X] - Magic link
[x] - Posthog
[X] - Stripe 
[X] - Stripe invoice.payment_failed
[X] - Renew free plan
[] - Meilleur mail pour tout
[] - Posthog events + stripe
[] - Guide de démarrage

Workflow :
1. Idée (questions, etc)
2. Plan
3. Dev
4. Test rapide
5. Review


# TODO - SaaS Boilerplate Implementation

Roadmap détaillée pour implémenter le boilerplate SaaS complet.

---

## 🎯 Phase 1: Configuration de base

### 1.1 Base de données (Drizzle ORM + Neon PostgreSQL)

- [ ] **Créer la base de données Neon**
  - [ ] Aller sur [neon.tech](https://neon.tech) et créer un compte
  - [ ] Créer un nouveau projet PostgreSQL
  - [ ] Copier la connection string (format: `postgresql://user:password@host/dbname`)

- [ ] **Installer les dépendances**
  ```bash
  pnpm add drizzle-orm @neondatabase/serverless
  pnpm add -D drizzle-kit
  ```

- [ ] **Créer la structure DB**
  - [ ] Créer `src/lib/db/index.ts` - Client Drizzle avec Neon
  - [ ] Créer `src/lib/db/schema/` - Dossier des schémas
  - [ ] Créer `drizzle.config.ts` - Config Drizzle Kit

- [ ] **Variables d'environnement**
  - [ ] Créer `.env.local` avec `DATABASE_URL` (connection string Neon)
  - [ ] Ajouter `.env.local` au `.gitignore`
  - [ ] Créer `.env.example` comme template

---

## 🔐 Phase 2: Authentification (Better Auth)

### 2.1 Installation Better Auth

- [ ] **Installer Better Auth**
  ```bash
  pnpm add better-auth
  ```

- [ ] **Configuration de base**
  - [ ] Créer `src/lib/auth/auth.ts` - Configuration Better Auth
  - [ ] Configurer Google OAuth
    - [ ] Obtenir Client ID et Secret de Google Cloud Console
    - [ ] Ajouter `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` dans `.env.local`
  - [ ] Configurer Magic Link
    - [ ] Configurer le provider email dans Better Auth
    - [ ] Ajouter les variables SMTP dans `.env.local`

### 2.2 Schémas DB pour l'auth

- [ ] **Créer les tables utilisateurs**
  - [ ] Créer `src/lib/db/schema/users.ts`
    ```typescript
    // Tables nécessaires:
    // - users: id, email, name, image, emailVerified, createdAt, updatedAt
    // - sessions: id, userId, expiresAt, createdAt
    // - accounts: id, userId, provider, providerAccountId
    // - verificationTokens: identifier, token, expiresAt
    ```

- [ ] **Ajouter les champs custom**
  - [ ] Ajouter `role` enum dans users (admin, user, beta)
  - [ ] Ajouter `plan` enum dans users (free, basic, pro)
  - [ ] Ajouter `credits` integer dans users (balance actuel)
  - [ ] Ajouter `featureFlags` jsonb dans users (array de strings)

### 2.3 Routes API Better Auth

- [ ] **Créer les routes d'authentification**
  - [ ] Créer `src/app/api/auth/[...all]/route.ts` - Handlers Better Auth
  - [ ] Tester la connexion Google OAuth
  - [ ] Tester le Magic Link

---

## 🛡️ Phase 3: Authorization & Guards

### 3.1 Helpers d'authorization

- [ ] **Créer `src/lib/auth/guards.ts`**
  - [ ] Implémenter `requireAuth()` - Vérifie si connecté, throw si non
  - [ ] Implémenter `requireRole(role: Role)` - Vérifie le rôle
  - [ ] Implémenter `requireRoles(roles: Role[])` - Vérifie plusieurs rôles
  - [ ] Implémenter `canAccessFeature(flag: string)` - Vérifie feature flag

- [ ] **Créer `src/lib/auth/session.ts`**
  - [ ] Fonction `getSession()` - Récupère la session courante
  - [ ] Type `SessionUser` - Interface session avec id, role, plan, credits, featureFlags

### 3.2 Middleware de protection

- [ ] **Créer `middleware.ts` à la racine**
  - [ ] Protéger les routes `/app/*` (require auth)
  - [ ] Protéger les routes `/admin/*` (require role admin)
  - [ ] Rediriger vers `/login` si non authentifié
  - [ ] Rediriger vers `/app` si auth mais accès admin sans rôle

---

## 💳 Phase 4: Système de crédits transactionnel

### 4.1 Schéma des transactions

- [ ] **Créer `src/lib/db/schema/credits.ts`**
  ```typescript
  // Table: credit_transactions
  // - id: string (uuid)
  // - userId: string (foreign key)
  // - amount: integer (+ ou -)
  // - type: enum (upgrade_plan, feature_use, admin_grant, refund, etc.)
  // - description: string
  // - metadata: jsonb (données additionnelles)
  // - createdAt: timestamp
  ```

### 4.2 Service de gestion des crédits

- [ ] **Créer `src/lib/credits/service.ts`**
  - [ ] Fonction `addCredits(userId, amount, type, description, metadata?)`
    - [ ] Créer une transaction
    - [ ] Mettre à jour le balance dans users.credits
    - [ ] Retourner la nouvelle balance
  - [ ] Fonction `deductCredits(userId, amount, type, description, metadata?)`
    - [ ] Vérifier la balance suffisante
    - [ ] Créer une transaction négative
    - [ ] Mettre à jour le balance
    - [ ] Throw error si balance insuffisante
  - [ ] Fonction `getUserBalance(userId)` - Récupère la balance actuelle
  - [ ] Fonction `getUserTransactions(userId, limit?, offset?)` - Historique

### 4.3 Types de transactions

- [ ] **Définir les types de transactions**
  - [ ] `upgrade_plan` - Upgrade vers un plan supérieur
  - [ ] `downgrade_plan` - Downgrade vers un plan inférieur
  - [ ] `feature_use` - Utilisation d'une fonctionnalité payante
  - [ ] `admin_grant` - Crédit accordé par admin
  - [ ] `refund` - Remboursement
  - [ ] `bonus` - Bonus promotionnel

---

## 🚀 Phase 5: Plans & Pricing

### 5.1 Configuration des plans

- [ ] **Créer `src/lib/plans/config.ts`**
  ```typescript
  // Définir les plans:
  // FREE: { credits: 10, features: [...] }
  // BASIC: { credits: 100, features: [...] }
  // PRO: { credits: 1000, features: [...] }
  ```

- [ ] **Helper functions**
  - [ ] `getPlanConfig(plan: Plan)` - Retourne la config du plan
  - [ ] `canUserAfford(userId, cost)` - Vérifie si l'user a assez de crédits
  - [ ] `hasUnlimitedCredits(userId)` - Vérifie si plan admin

### 5.2 Server Actions pour les plans

- [ ] **Créer `src/app/actions/plans.ts`**
  - [ ] Action `upgradePlan(plan: Plan)` - Upgrade le plan utilisateur
  - [ ] Action `downgradePlan(plan: Plan)` - Downgrade le plan
  - [ ] Mettre à jour les crédits selon le plan
  - [ ] Créer les transactions associées

---

## 🎛️ Phase 6: Feature Flags

### 6.1 Gestion des feature flags

- [ ] **Créer `src/lib/features/flags.ts`**
  ```typescript
  // Liste des feature flags disponibles
  // Ex: 'ai-assistant', 'advanced-analytics', 'api-access', etc.
  ```

- [ ] **Helper functions**
  - [ ] `hasFeature(userId, flag)` - Vérifie si user a accès à la feature
  - [ ] `addFeature(userId, flag)` - Ajoute une feature à un user
  - [ ] `removeFeature(userId, flag)` - Retire une feature
  - [ ] `getUserFeatures(userId)` - Liste les features actives

### 6.2 Server Actions features

- [ ] **Créer `src/app/actions/features.ts`**
  - [ ] Action `enableFeature(userId, flag)` - Active une feature (admin only)
  - [ ] Action `disableFeature(userId, flag)` - Désactive une feature (admin only)

---

## 🗂️ Phase 7: Structure des routes

### 7.1 Routes publiques - `(public)`

- [ ] **Créer les layouts et pages**
  - [ ] Créer `src/app/(public)/layout.tsx` - Layout public (header, footer)
  - [ ] Créer `src/app/(public)/page.tsx` - Landing page
  - [ ] Créer `src/app/(public)/login/page.tsx` - Page de connexion
  - [ ] Créer `src/app/(public)/pricing/page.tsx` - Page pricing

### 7.2 Routes client - `(app)`

- [ ] **Layout avec sidebar**
  - [ ] Créer `src/app/(app)/(with-sidebar)/layout.tsx`
    - [ ] Ajouter la sidebar (navigation app)
    - [ ] Afficher le role et les crédits
  - [ ] Créer `src/app/(app)/(with-sidebar)/dashboard/page.tsx` - Dashboard user
  - [ ] Créer `src/app/(app)/(with-sidebar)/settings/page.tsx` - Paramètres user
  - [ ] Créer `src/app/(app)/(with-sidebar)/credits/page.tsx` - Page crédits (historique)

- [ ] **Layout sans sidebar**
  - [ ] Créer `src/app/(app)/(without-sidebar)/layout.tsx`
  - [ ] Créer `src/app/(app)/(without-sidebar)/onboarding/page.tsx` - Onboarding
  - [ ] Créer `src/app/(app)/(without-sidebar)/profile/edit/page.tsx` - Édition profil

### 7.3 Routes admin - `(admin)`

- [ ] **Créer l'espace admin**
  - [ ] Créer `src/app/(admin)/layout.tsx` - Layout admin avec sidebar dédiée
  - [ ] Créer `src/app/(admin)/dashboard/page.tsx` - Dashboard admin
    - [ ] Afficher le nombre total d'utilisateurs
    - [ ] Afficher la répartition par rôle (chart)
    - [ ] Afficher la répartition par plan (chart)
    - [ ] Stats clés (revenue, crédits distribués, etc.)

- [ ] **Gestion utilisateurs**
  - [ ] Créer `src/app/(admin)/users/page.tsx` - Liste des users
    - [ ] Tableau avec recherche et filtres
    - [ ] Colonnes: email, name, role, plan, credits, createdAt
    - [ ] Actions: voir détails, modifier
  - [ ] Créer `src/app/(admin)/users/[id]/page.tsx` - Détails user
    - [ ] Afficher toutes les infos
    - [ ] Formulaire pour modifier role
    - [ ] Formulaire pour modifier plan
    - [ ] Formulaire pour ajouter/retirer des crédits (avec raison)
    - [ ] Historique des transactions
    - [ ] Feature flags actives

- [ ] **Gestion feature flags**
  - [ ] Créer `src/app/(admin)/features/page.tsx` - Liste des feature flags
    - [ ] Liste des flags disponibles
    - [ ] Nombre d'users par flag
    - [ ] Action: gérer les users
  - [ ] Créer `src/app/(admin)/features/[flag]/page.tsx` - Détails d'un flag
    - [ ] Liste des users ayant ce flag
    - [ ] Formulaire pour ajouter un user au flag
    - [ ] Action: retirer le flag d'un user

---

## 🎨 Phase 8: Composants UI

### 8.1 Composants d'auth

- [ ] **Créer les composants de connexion**
  - [ ] `src/components/auth/login-form.tsx` - Formulaire login
  - [ ] `src/components/auth/google-button.tsx` - Bouton Google OAuth
  - [ ] `src/components/auth/magic-link-form.tsx` - Formulaire Magic Link
  - [ ] `src/components/auth/user-button.tsx` - Dropdown user menu (header)

### 8.2 Composants sidebar

- [ ] **Créer les sidebars**
  - [ ] `src/components/layout/app-sidebar.tsx` - Sidebar app client
    - [ ] Navigation: Dashboard, Settings, Credits
    - [ ] Footer: User info, crédits restants
  - [ ] `src/components/layout/admin-sidebar.tsx` - Sidebar admin
    - [ ] Navigation: Dashboard, Users, Features

### 8.3 Composants crédits

- [ ] **Créer les composants de crédits**
  - [ ] `src/components/credits/balance-card.tsx` - Affichage balance
  - [ ] `src/components/credits/transaction-list.tsx` - Liste transactions
  - [ ] `src/components/credits/add-credits-form.tsx` - Form admin ajouter crédits

### 8.4 Composants admin

- [ ] **Créer les composants admin**
  - [ ] `src/components/admin/user-table.tsx` - Tableau users
  - [ ] `src/components/admin/user-role-select.tsx` - Select pour modifier role
  - [ ] `src/components/admin/user-plan-select.tsx` - Select pour modifier plan
  - [ ] `src/components/admin/feature-flag-toggle.tsx` - Toggle feature flag
  - [ ] `src/components/admin/stats-cards.tsx` - Cartes de statistiques

---

## 📝 Phase 9: Formulaires (React Hook Form + Zod)

### 9.1 Installation

- [ ] **Installer les dépendances**
  ```bash
  pnpm add react-hook-form zod @hookform/resolvers
  ```

### 9.2 Schémas de validation

- [ ] **Créer `src/lib/validations/`**
  - [ ] `auth.ts` - Schémas login, register, magic link
  - [ ] `user.ts` - Schémas update profile
  - [ ] `admin.ts` - Schémas admin actions (change role, add credits, etc.)

### 9.3 Composants de formulaire

- [ ] **Wrapper shadcn/ui avec RHF**
  - [ ] Créer `src/components/forms/form-field.tsx` - Wrapper générique
  - [ ] Intégrer avec les schémas Zod
  - [ ] Affichage des erreurs automatique

---

## 🔧 Phase 10: Server Actions

### 10.1 Actions utilisateur

- [ ] **Créer `src/app/actions/user.ts`**
  - [ ] Action `updateProfile(data)` - Modifier profil
  - [ ] Action `deleteAccount()` - Supprimer compte

### 10.2 Actions admin

- [ ] **Créer `src/app/actions/admin.ts`**
  - [ ] Action `updateUserRole(userId, role)` - Modifier rôle (guard admin)
  - [ ] Action `updateUserPlan(userId, plan)` - Modifier plan (guard admin)
  - [ ] Action `grantCredits(userId, amount, reason)` - Accorder crédits
  - [ ] Action `revokeCredits(userId, amount, reason)` - Retirer crédits
  - [ ] Action `getUserStats()` - Récupérer les stats dashboard admin

---

## 🎯 Phase 11: Gestion d'erreurs

### 11.1 Error handling

- [ ] **Créer `src/lib/errors/`**
  - [ ] `src/lib/errors/app-error.ts` - Classe d'erreur custom
    ```typescript
    // Types: AuthError, AuthorizationError, InsufficientCreditsError, etc.
    ```
  - [ ] `src/lib/errors/handler.ts` - Handler global d'erreurs
    - [ ] Logger les erreurs critiques uniquement
    - [ ] Formater les erreurs pour l'UI

### 11.2 Composants d'erreur

- [ ] **Créer les pages d'erreur**
  - [ ] `src/app/error.tsx` - Page erreur générique
  - [ ] `src/app/not-found.tsx` - Page 404
  - [ ] `src/app/(app)/unauthorized/page.tsx` - Page accès refusé

---

## 🎨 Phase 12: UI/UX Enhancements

### 12.1 Theme et styles

- [ ] **Dark mode**
  - [ ] Configurer next-themes (déjà installé)
  - [ ] Créer `src/components/theme-toggle.tsx`
  - [ ] Intégrer dans les layouts

### 12.2 Feedback utilisateur

- [ ] **Toasts et notifications**
  - [ ] Utiliser Sonner (déjà installé)
  - [ ] Créer `src/lib/toast.ts` - Helpers toast
  - [ ] Intégrer dans les Server Actions (succès/erreur)

### 12.3 Loading states

- [ ] **États de chargement**
  - [ ] Créer `loading.tsx` pour chaque route importante
  - [ ] Utiliser le composant Spinner de shadcn
  - [ ] React Suspense pour les composants async

---

## 🧪 Phase 13: Testing & Migrations

### 13.1 Migrations DB

- [ ] **Créer les migrations Drizzle**
  ```bash
  pnpm drizzle-kit generate
  pnpm drizzle-kit migrate
  ```

### 13.2 Seed data

- [ ] **Créer `src/lib/db/seed.ts`**
  - [ ] Créer un user admin par défaut
  - [ ] Créer quelques users de test (free, basic, pro)
  - [ ] Créer des transactions de test
  - [ ] Ajouter des feature flags de test

---

## 🚀 Phase 14: Polish & Documentation

### 14.1 Documentation

- [ ] **Mettre à jour CLAUDE.md** avec les patterns finaux
- [ ] **Créer ARCHITECTURE.md** - Schémas de l'architecture
- [ ] **Créer API.md** - Documentation des Server Actions

### 14.2 Types & Lint

- [ ] **S'assurer de la qualité du code**
  - [ ] Vérifier que tous les types sont stricts
  - [ ] Pas de `any` dans le code
  - [ ] Linter passe sans erreurs
  - [ ] Formatter le code (Prettier)

### 14.3 Environment variables

- [ ] **Documenter toutes les env vars dans `.env.example`**
  ```
  DATABASE_URL=
  GOOGLE_CLIENT_ID=
  GOOGLE_CLIENT_SECRET=
  NEXTAUTH_SECRET=
  SMTP_HOST=
  SMTP_PORT=
  SMTP_USER=
  SMTP_PASSWORD=
  ```

---

## ✅ Phase 15: Go Live Checklist

- [ ] Toutes les routes fonctionnent
- [ ] Auth Google OAuth fonctionne
- [ ] Magic Link fonctionne
- [ ] Guards (requireAuth, requireRole) fonctionnent
- [ ] Système de crédits transactionnel fonctionne
- [ ] Admin peut modifier roles/plans/crédits
- [ ] Feature flags fonctionnent
- [ ] Dashboard admin affiche les stats
- [ ] Pas d'erreurs dans la console
- [ ] Migrations DB appliquées
- [ ] Seed data créé
- [ ] Documentation à jour

---

## 🎯 Ordre d'implémentation recommandé

1. **Base technique** : DB + Auth (Phases 1-2)
2. **Authorization** : Guards + Middleware (Phase 3)
3. **Crédits** : Transactions + Service (Phase 4)
4. **Plans** : Config + Actions (Phase 5)
5. **Features** : Flags + Actions (Phase 6)
6. **Routes** : Public → App → Admin (Phase 7)
7. **UI** : Composants + Forms (Phases 8-9)
8. **Actions** : Server Actions (Phase 10)
9. **Polish** : Errors + UX (Phases 11-12)
10. **Finish** : Tests + Docs + Deploy (Phases 13-15)
