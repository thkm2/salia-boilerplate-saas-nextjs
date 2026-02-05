# Rate Limiting

Rate limiter in-memory simple pour protéger les routes sensibles contre les abus.

## Comment ça marche

Le rate limiter utilise une **sliding window** basée sur les timestamps :

1. Chaque requête est identifiée par une **clé unique** (ex: `auth:192.168.1.1`)
2. On garde les timestamps des requêtes dans une fenêtre de temps
3. Si le nombre de requêtes dépasse la limite → requête bloquée
4. Nettoyage automatique des anciennes entrées toutes les 5 minutes

```
src/lib/rate-limit.ts
```

## API

```typescript
import { rateLimit } from "@/lib/rate-limit";

const { success, remaining } = rateLimit(
  key,      // Identifiant unique (string)
  limit,    // Nombre max de requêtes
  windowMs  // Fenêtre de temps en ms
);

// success: true si la requête est autorisée
// remaining: nombre de requêtes restantes
```

## Utilisation

### 1. Route API basique

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const LIMIT = 10;
const WINDOW = 60 * 1000; // 1 minute

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`example:${ip}`, LIMIT, WINDOW);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // ... logique normale
}
```

### 2. Rate limit par utilisateur (authentifié)

```typescript
import { requireAuth } from "@/lib/auth/guards";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const { session } = await requireAuth();

  const { success } = rateLimit(
    `api:${session.user.id}`,  // Par user ID
    100,                        // 100 requêtes
    60 * 60 * 1000             // Par heure
  );

  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  // ...
}
```

### 3. Rate limit conditionnel (comme l'auth)

```typescript
// Appliquer uniquement sur certaines routes
async function POST(request: NextRequest): Promise<Response> {
  const pathname = request.nextUrl.pathname;

  // Rate limit seulement sur /sign-in/
  if (pathname.includes("/sign-in/")) {
    const ip = getClientIp(request);
    const { success } = rateLimit(`auth:${ip}`, 10, 60000);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests." },
        { status: 429 }
      );
    }
  }

  return originalHandler(request);
}
```

### 4. Server Action

```typescript
"use server";

import { rateLimit } from "@/lib/rate-limit";
import { requireAuth } from "@/lib/auth/guards";

export async function sendMessage(content: string) {
  const { session } = await requireAuth();

  const { success } = rateLimit(`message:${session.user.id}`, 5, 60000);

  if (!success) {
    return { error: "Trop de messages. Attendez une minute." };
  }

  // ... envoyer le message
}
```

## Gestion côté client

Quand une requête est rate limited (status 429), afficher un message clair :

```typescript
const { error } = await someAction();

if (error) {
  const isRateLimit =
    error.status === 429 ||
    error.message?.toLowerCase().includes("too many");

  if (isRateLimit) {
    toast.error("Trop de tentatives. Réessayez dans une minute.");
  } else {
    toast.error("Une erreur est survenue.");
  }
}
```

## Limites recommandées

| Route | Limite | Fenêtre | Clé |
|-------|--------|---------|-----|
| Auth (sign-in) | 10 | 1 min | `auth:{ip}` |
| API publique | 60 | 1 min | `api:{ip}` |
| API authentifiée | 100 | 1 min | `api:{userId}` |
| Actions sensibles | 5 | 1 min | `action:{userId}` |

## Limitations

- **In-memory** : Les données sont perdues au redémarrage du serveur
- **Single instance** : Ne fonctionne pas avec plusieurs instances (load balancing)
- **Pas de persistance** : Un attaquant peut contourner en attendant un redémarrage

## Pour la production à grande échelle

Considérer une solution Redis :

```typescript
// Exemple avec Upstash Redis (à implémenter si nécessaire)
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
});
```
