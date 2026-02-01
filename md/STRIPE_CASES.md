# Stripe — Tous les cas de facturation

Guide complet de tous les scénarios Stripe de l'application. Chaque cas est détaillé du clic utilisateur jusqu'à la base de données.

---

## Configuration des plans

| Plan  | Prix   | Crédits/mois | Stripe Price ID          |
|-------|--------|--------------|--------------------------|
| Free  | 0 €    | 10           | aucun                    |
| Basic | 9 €/mo | 100          | `STRIPE_PRICE_BASIC`     |
| Pro   | 29 €/mo| 500          | `STRIPE_PRICE_PRO`       |

---

## Cas 1 — Inscription (nouveau compte)

**Situation** : Un utilisateur crée son compte.

**Résultat** :
- Plan = `free`, crédits = `10`, pas de `stripeCustomerId`, pas de `stripeSubscriptionId`
- Aucune interaction Stripe

**Base de données** :
```
user.plan = "free"
user.credits = 10
user.stripeCustomerId = null
user.stripeSubscriptionId = null
user.creditsResetAt = null
```

---

## Cas 2 — Utilisateur free qui utilise des crédits

**Situation** : L'utilisateur est sur le plan Free (10 crédits) et utilise 5 crédits.

### Client
- L'app appelle `useCredits(5, "feature_use", "Génération de rapport")`

### Backend
1. `requireAuth()` vérifie la session
2. `maybeRenewFreeCredits()` vérifie si on est dans un nouveau mois → si oui, renouvelle à 10
3. UPDATE atomique : `credits = credits - 5` WHERE `credits >= 5`
4. Log dans `credit_transaction` : `amount: -5, type: "feature_use"`

**Base de données après** :
```
user.credits = 5
credit_transaction: { amount: -5, type: "feature_use", description: "Génération de rapport" }
```

**Si crédits insuffisants** : L'UPDATE échoue (WHERE `credits >= amount`), retourne `{ error: "insufficient_credits" }`. Rien n'est modifié en base.

---

## Cas 3 — Free vers Basic (premier abonnement)

**Situation** : L'utilisateur est sur Free avec 5/10 crédits. Il upgrade vers Basic (9 €/mo).

### Client
1. Page `/plans` → clic sur "Upgrade" sur la carte Basic
2. `PlanCard` appelle `createCheckoutSession("basic")`

### Backend — Création de la session Checkout
1. `requireAuth()` vérifie la session
2. Pas de `stripeCustomerId` → création d'un customer Stripe avec email + metadata `userId`
3. Sauvegarde du `stripeCustomerId` en base
4. Création d'une Checkout Session Stripe en mode `subscription`
5. Redirect vers la page Stripe Checkout

### Stripe Checkout
- L'utilisateur remplit sa carte bancaire sur la page Stripe
- Paiement de **9 €** immédiat
- Stripe crée un `Subscription` + une première `Invoice`

### Webhook — `checkout.session.completed`
1. Récupère `userId` et `planId` depuis `session.metadata`
2. Transaction DB :
   - `user.plan = "basic"`
   - `user.credits = 100` (reset complet aux crédits du plan)
   - `user.stripeSubscriptionId = sub_xxx`
   - `user.creditsResetAt = now()`
3. Log : `credit_transaction { amount: 100, type: "subscription_start" }`

**Les 5 crédits restants du plan Free sont perdus.** Les crédits sont remis à la valeur du nouveau plan (100), pas additionnés.

### Client — Retour
- Redirect vers `/plans?success=true`
- `CheckoutResult` affiche un toast : "Subscription activated!"
- `router.replace("/plans")` nettoie l'URL

---

## Cas 4 — Free vers Pro (premier abonnement)

Identique au Cas 3, mais :
- Paiement de **29 €** immédiat
- `user.credits = 500`
- `credit_transaction { amount: 500, type: "subscription_start" }`

---

## Cas 5 — Basic vers Pro (upgrade en milieu de mois)

**Situation** : L'utilisateur est sur Basic depuis le 1er du mois, a utilisé 40 crédits (reste 60/100). Le 15 du mois, il passe Pro.

### Client
1. Page `/plans` → clic sur "Change plan" sur la carte Pro
2. `PlanCard` détecte que l'utilisateur est déjà abonné → appelle `createBillingPortalSession()`
3. Redirect vers le **Stripe Billing Portal**

### Stripe Billing Portal
- L'utilisateur choisit le plan Pro dans le portail Stripe
- **Stripe calcule le prorata automatiquement** :
  - Crédit restant du Basic : ~4,50 € (moitié du mois non utilisée)
  - Coût du Pro pour le reste du mois : ~14,50 € (moitié de 29 €)
  - **Facturé immédiatement** : ~10 € (14,50 - 4,50)
  - Prochaine facture le 1er du mois suivant : **29 €** complet

### Webhook — `customer.subscription.updated`
1. Récupère le nouveau `priceId` depuis `subscription.items.data[0].price.id`
2. `planIdFromPriceId()` → `"pro"`
3. Transaction DB (seulement si `user.plan != "pro"` → idempotent) :
   - `user.plan = "pro"`
   - `user.credits = 500` (reset complet)
   - `user.creditsResetAt = now()`
4. Log : `credit_transaction { amount: 500, type: "plan_change", description: "Plan changed to Pro" }`

**Les 60 crédits restants du Basic sont perdus.** Reset à 500 crédits Pro.

**Prorata géré par Stripe**, pas par notre code. Notre webhook ne touche qu'aux crédits et au plan en base.

---

## Cas 6 — Pro vers Basic (downgrade en milieu de mois)

**Situation** : L'utilisateur est sur Pro, a utilisé 200 crédits (reste 300/500). Il passe à Basic.

### Client
1. Clic "Change plan" → `createBillingPortalSession()` → Billing Portal

### Stripe Billing Portal
- Stripe applique le prorata :
  - Crédit restant du Pro : portion de 29 €
  - Coût du Basic pour le reste du mois : portion de 9 €
  - **Le solde positif est crédité** sur la prochaine facture (pas de remboursement direct)
  - Prochaine facture : **9 €** - crédit prorata

### Webhook — `customer.subscription.updated`
1. `planIdFromPriceId()` → `"basic"`
2. Transaction DB :
   - `user.plan = "basic"`
   - `user.credits = 100` (reset complet)
   - `user.creditsResetAt = now()`
3. Log : `credit_transaction { amount: 100, type: "plan_change" }`

**Les 300 crédits restants du Pro sont perdus.** Reset à 100 crédits Basic.

---

## Cas 7 — Annulation d'un abonnement payant

**Situation** : L'utilisateur est sur Basic ou Pro et annule son abonnement.

### Client
1. `CurrentPlanCard` → clic "Manage subscription" → `createBillingPortalSession()`
2. Dans le Billing Portal, clic "Cancel subscription"

### Comportement Stripe
- Par défaut, **l'annulation prend effet à la fin de la période de facturation**
- L'utilisateur garde son plan payant jusqu'à la fin du mois
- Quand la période expire, Stripe déclenche `customer.subscription.deleted`

### Webhook — `customer.subscription.deleted`
1. Transaction DB (seulement si `user.plan != "free"` → idempotent) :
   - `user.plan = "free"`
   - `user.credits = 10` (reset aux crédits Free)
   - `user.stripeSubscriptionId = null`
   - `user.creditsResetAt = now()`
2. Log : `credit_transaction { amount: 10, type: "subscription_canceled" }`

**Tout crédit restant est perdu.** L'utilisateur repart avec 10 crédits Free.

---

## Cas 8 — Renouvellement mensuel (facture payée)

**Situation** : L'utilisateur est sur Basic. Le 1er du mois, Stripe facture 9 €.

### Stripe
- Crée une `Invoice` avec `billing_reason: "subscription_cycle"`
- Paiement réussi → déclenche `invoice.paid`

### Webhook — `invoice.paid`
1. Skip si `billing_reason === "subscription_create"` (déjà traité par checkout)
2. Trouve l'utilisateur via `stripeSubscriptionId`
3. Vérifie idempotence : `creditsResetAt < periodStart` (début de la nouvelle période)
4. Transaction DB :
   - `user.credits = 100` (reset complet, pas d'ajout)
   - `user.creditsResetAt = now()`
5. Log : `credit_transaction { amount: 100, type: "subscription_renewal" }`

**Même si l'utilisateur avait encore 80 crédits, il est remis à 100.** Les crédits ne se cumulent pas.

---

## Cas 9 — Renouvellement mensuel des crédits Free (lazy renewal)

**Situation** : L'utilisateur est sur Free, a utilisé tous ses crédits le mois dernier. On est le 3 du nouveau mois.

### Déclenchement
- Pas de webhook, pas de cron job
- Se déclenche **à la première utilisation de crédits** du mois via `maybeRenewFreeCredits()`

### Backend — `maybeRenewFreeCredits()`
1. Vérifie `currentPlan === "free"` (sinon return false)
2. Compare le mois UTC de `creditsResetAt` avec le mois actuel
3. Si mois différent → UPDATE atomique :
   - `user.credits = 10`
   - `user.creditsResetAt = now()`
   - WHERE `creditsResetAt IS NULL OR creditsResetAt < premier jour du mois`
4. Log : `credit_transaction { amount: 10, type: "free_monthly_renewal" }`

**Lazy = les crédits se renouvellent uniquement quand l'utilisateur les utilise, pas automatiquement le 1er du mois.**

---

## Cas 10 — Échec de paiement

**Situation** : La carte de l'utilisateur est expirée ou refusée lors du renouvellement.

### Stripe
- Déclenche `invoice.payment_failed`
- **Stripe gère les relances automatiquement** (Smart Retries)
- En général : 3-4 tentatives sur ~1 mois

### Webhook — `invoice.payment_failed`
1. Log `console.error` avec `invoiceId`, `customerId`, `subscriptionId`
2. **Aucune modification en base**
3. L'utilisateur garde son plan tant que Stripe n'a pas abandonné

### Si Stripe abandonne (toutes les relances échouent)
- Stripe annule le subscription → déclenche `customer.subscription.deleted`
- → Retombe sur le Cas 7 (downgrade vers Free)

---

## Cas 11 — Checkout annulé par l'utilisateur

**Situation** : L'utilisateur est redirigé vers Stripe Checkout mais ferme la page ou clique "Retour".

### Stripe
- Aucun événement webhook déclenché
- Aucun paiement effectué
- Le `Checkout Session` expire après 24h

### Client
- Redirect vers `/plans?canceled=true`
- `CheckoutResult` affiche un toast : "Checkout canceled. No changes were made."
- Aucun changement en base

---

## Cas 12 — Double webhook (retry Stripe)

**Situation** : Stripe renvoie le même événement 2 fois (timeout réseau, etc.).

Chaque webhook handler est **idempotent** grâce à des gardes SQL :

| Webhook | Garde d'idempotence |
|---------|---------------------|
| `checkout.session.completed` | `stripeSubscriptionId != sub_xxx` (ne met à jour que si le sub ID n'est pas déjà en place) |
| `invoice.paid` | `creditsResetAt < periodStart` (ne renouvelle que si pas déjà renouvelé pour cette période) |
| `customer.subscription.updated` | `plan != newPlanId` (ne change que si le plan est réellement différent) |
| `customer.subscription.deleted` | `plan != "free"` (ne downgrade que si pas déjà free) |

**Résultat** : La 2ème exécution du webhook ne modifie rien. Le WHERE SQL ne matche aucune ligne → `updated` est undefined → early return.

---

## Cas 13 — Utilisateur Free qui essaie de checkout vers Free

**Situation** : Edge case — appel direct `createCheckoutSession("free")`.

### Backend
- `PLANS["free"].stripePriceId === null`
- `throw new Error("Cannot checkout for free plan")`
- **Bloqué immédiatement**

---

## Cas 14 — Utilisateur payant qui utilise le Billing Portal

**Situation** : L'utilisateur clique sur "Manage subscription" sur la page Plans.

### Client
1. `CurrentPlanCard` → `createBillingPortalSession()`
2. Redirect vers Stripe Billing Portal

### Stripe Billing Portal — Actions possibles
| Action | Webhook déclenché | Cas associé |
|--------|-------------------|-------------|
| Changer de plan | `customer.subscription.updated` | Cas 5 ou 6 |
| Annuler l'abonnement | `customer.subscription.deleted` | Cas 7 |
| Mettre à jour la carte | Aucun | Aucun changement en base |
| Voir les factures | Aucun | Aucun changement en base |

---

## Résumé des flux

```
┌─────────────────────────────────────────────────────┐
│                   UTILISATEUR                        │
└──────────┬──────────────────────────────┬────────────┘
           │                              │
    ┌──────▼──────┐              ┌────────▼────────┐
    │  Plan Free   │              │  Plan Payant     │
    │  (pas Stripe)│              │  (abonnement)    │
    └──────┬──────┘              └────────┬────────┘
           │                              │
    ┌──────▼──────────────┐      ┌────────▼────────────┐
    │ Upgrade             │      │ Change/Cancel/Manage │
    │ → Checkout Session  │      │ → Billing Portal     │
    │ → Paiement Stripe   │      │ → Actions Stripe     │
    └──────┬──────────────┘      └────────┬────────────┘
           │                              │
    ┌──────▼──────────────────────────────▼────────────┐
    │              WEBHOOKS STRIPE                      │
    │                                                   │
    │  checkout.session.completed → set plan + crédits  │
    │  invoice.paid               → renouveler crédits  │
    │  subscription.updated       → changer plan        │
    │  subscription.deleted       → downgrade free      │
    │  invoice.payment_failed     → log erreur          │
    └──────────────────────┬───────────────────────────┘
                           │
    ┌──────────────────────▼───────────────────────────┐
    │              BASE DE DONNÉES                      │
    │                                                   │
    │  user: plan, credits, stripeSubscriptionId,       │
    │        stripeCustomerId, creditsResetAt            │
    │                                                   │
    │  credit_transaction: audit trail complet           │
    └──────────────────────────────────────────────────┘
```

---

## Tableau récapitulatif des transitions

| De → Vers | Mécanisme | Paiement | Crédits | Webhook |
|-----------|-----------|----------|---------|---------|
| Free → Basic | Checkout | 9 € immédiat | Reset à 100 | `checkout.session.completed` |
| Free → Pro | Checkout | 29 € immédiat | Reset à 500 | `checkout.session.completed` |
| Basic → Pro | Billing Portal | ~10 € prorata | Reset à 500 | `subscription.updated` |
| Pro → Basic | Billing Portal | Crédit prorata | Reset à 100 | `subscription.updated` |
| Basic → Free | Billing Portal (cancel) | Rien (fin de période) | Reset à 10 | `subscription.deleted` |
| Pro → Free | Billing Portal (cancel) | Rien (fin de période) | Reset à 10 | `subscription.deleted` |
| Renouvellement | Automatique Stripe | Prix du plan | Reset au max | `invoice.paid` |
| Échec paiement | Automatique Stripe | Relances auto | Inchangé | `invoice.payment_failed` |

---

## Points clés à retenir

1. **Les crédits ne se cumulent jamais.** À chaque changement de plan ou renouvellement, les crédits sont remis à la valeur du plan (pas d'addition).

2. **Le prorata est géré par Stripe**, pas par notre code. On ne calcule rien côté backend.

3. **Tous les webhooks sont idempotents.** Les gardes SQL empêchent le double traitement.

4. **Free → Payant = Checkout Session.** Payant → autre plan = Billing Portal. C'est la seule distinction côté client.

5. **L'annulation prend effet en fin de période.** L'utilisateur garde son plan payant jusqu'à la fin du mois en cours.

6. **Le renouvellement Free est "lazy".** Pas de cron, les crédits se reset à la première utilisation du mois.

7. **Chaque opération de crédits est tracée** dans `credit_transaction` avec type, montant, et description.
