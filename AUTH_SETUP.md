# Authentication Setup - Better Auth

L'authentification a été configurée avec succès en utilisant Better Auth, Drizzle ORM et Neon PostgreSQL.

## ✅ Ce qui a été implémenté

### 1. Base de données
- **Schémas Drizzle** créés dans `src/lib/db/schema/`:
  - `user` - Utilisateurs avec rôles, plans, crédits, feature flags
  - `session` - Sessions d'authentification
  - `account` - Comptes OAuth liés
  - `verification` - Tokens de vérification
  - `credit_transaction` - Historique transactionnel des crédits

- **Migrations** générées et appliquées à la base de données Neon

### 2. Configuration Better Auth
- **Fichier**: `src/lib/auth/auth.ts`
- **Méthodes activées**:
  - ✅ Google OAuth (credentials à ajouter)
  - 🚧 Magic Link (préparé, à activer avec Resend)

- **Champs utilisateur personnalisés**:
  - `role`: "admin" | "user" | "beta"
  - `plan`: "free" | "basic" | "pro" | "admin"
  - `credits`: Nombre de crédits
  - `featureFlags`: Flags de fonctionnalités (JSON)
  - `firstLoginAt`: Date de première connexion
  - `lastLoginAt`: Date de dernière connexion

### 3. Guards d'authentification
- **Fichier**: `src/lib/auth/guards.ts`
- **Fonctions disponibles**:
  - `getSession()` - Récupérer la session actuelle
  - `requireAuth()` - Exiger authentification (redirect vers /login)
  - `requireRole(role)` - Exiger un rôle spécifique
  - `canAccessFeature(feature)` - Vérifier accès à une fonctionnalité
  - `requireFeature(feature)` - Exiger accès à une fonctionnalité
  - `hasEnoughCredits(amount)` - Vérifier crédits suffisants
  - `getUserPlan()` - Obtenir le plan de l'utilisateur

### 4. Client Auth React
- **Fichier**: `src/lib/auth/client.ts`
- **Exports**: `signIn`, `signUp`, `signOut`, `useSession`, `getSession`

### 5. Pages d'authentification
- **Page**: `/auth` (`src/app/(public)/auth/page.tsx`)
- Interface simple et sécurisée avec:
  - Google OAuth
  - Magic Link (disabled, à activer plus tard)

### 6. Dashboard de test
- **Page**: `/dashboard` (`src/app/(app)/(with-sidebar)/dashboard/page.tsx`)
- Affiche les informations utilisateur et permet de se déconnecter

## 🔧 Configuration requise

### 1. Ajouter les credentials Google OAuth

1. Créez un projet sur [Google Cloud Console](https://console.cloud.google.com/)
2. Activez l'API Google+ et créez des credentials OAuth 2.0
3. Ajoutez les URLs autorisées:
   - Dev: `http://localhost:3000`
   - Callback: `http://localhost:3000/api/auth/callback/google`
4. Ajoutez les credentials dans `.env`:

```bash
GOOGLE_CLIENT_ID=votre_client_id
GOOGLE_CLIENT_SECRET=votre_client_secret
```

### 2. Activer Magic Link (optionnel)

Pour activer Magic Link avec Resend:

1. Installez Resend:
```bash
pnpm add resend
```

2. Ajoutez votre clé API Resend dans `.env`:
```bash
RESEND_API_KEY=re_...
```

3. Décommentez et configurez le plugin dans `src/lib/auth/auth.ts`:
```typescript
import { magicLink } from "better-auth/plugins/magic-link";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Dans la configuration betterAuth
plugins: [
  magicLink({
    sendMagicLink: async ({ email, url, token }) => {
      await resend.emails.send({
        from: "noreply@votredomaine.com",
        to: email,
        subject: "Connexion à votre compte",
        html: \`<a href="\${url}">Cliquez ici pour vous connecter</a>\`,
      });
    },
  }),
],
```

4. Retirez `disabled={true}` du bouton Magic Link dans `src/app/(public)/auth/page.tsx`

## 📁 Structure des fichiers

```
src/
├── lib/
│   ├── auth/
│   │   ├── auth.ts          # Configuration Better Auth
│   │   ├── client.ts        # Client React
│   │   ├── guards.ts        # Guards d'authentification
│   │   └── types.ts         # Types TypeScript
│   └── db/
│       ├── index.ts         # Client Drizzle
│       └── schema/
│           ├── user.ts      # Schémas auth
│           ├── credits.ts   # Schéma crédits
│           └── index.ts     # Export
├── app/
│   ├── api/auth/[...all]/
│   │   └── route.ts         # Handler API Better Auth
│   ├── (public)/
│   │   └── auth/
│   │       └── page.tsx     # Page login/signup
│   └── (app)/(with-sidebar)/
│       └── dashboard/
│           └── page.tsx     # Dashboard protégé
```

## 🚀 Utilisation

### Protéger une page

```typescript
// src/app/(app)/ma-page/page.tsx
import { requireAuth } from "@/lib/auth/guards";

export default async function MaPage() {
  const session = await requireAuth(); // Redirect si non authentifié

  return <div>Page protégée</div>;
}
```

### Vérifier un rôle

```typescript
import { requireRole } from "@/lib/auth/guards";

export default async function AdminPage() {
  const session = await requireRole("admin");

  return <div>Page admin</div>;
}
```

### Utiliser dans un composant client

```typescript
"use client";

import { useSession, signOut } from "@/lib/auth/client";

export function UserMenu() {
  const { data: session } = useSession();

  if (!session) return <LoginButton />;

  return (
    <div>
      <p>Bonjour {session.user.name}</p>
      <button onClick={() => signOut()}>Déconnexion</button>
    </div>
  );
}
```

## 📝 Scripts disponibles

```bash
# Générer une nouvelle migration
pnpm db:generate

# Appliquer les migrations
pnpm db:push

# Ouvrir Drizzle Studio
pnpm db:studio
```

## 🔐 Sécurité

- Les mots de passe sont hashés automatiquement par Better Auth
- Les sessions sont stockées dans la base de données
- CSRF protection activé par défaut
- Les cookies sont sécurisés (httpOnly, sameSite)

## 📚 Ressources

- [Better Auth Documentation](https://better-auth.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🐛 Troubleshooting

### Erreur "DATABASE_URL is not set"
Vérifiez que `.env` contient bien `DATABASE_URL`.

### Google OAuth ne fonctionne pas
1. Vérifiez que `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` sont définis
2. Vérifiez les URLs autorisées dans Google Cloud Console
3. Redémarrez le serveur de développement

### Types TypeScript manquants
Les champs additionnels (role, plan, credits, etc.) nécessitent un cast:
```typescript
const session = await requireAuth();
const role = (session.user as any).role;
```

Ceci est normal et sera amélioré dans une prochaine version avec une meilleure inférence de types.
