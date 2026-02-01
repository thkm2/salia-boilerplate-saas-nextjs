if (!process.env.STRIPE_PRICE_BASIC) {
  console.warn("STRIPE_PRICE_BASIC is not set — paid plan checkout will fail");
}

if (!process.env.STRIPE_PRICE_PRO) {
  console.warn("STRIPE_PRICE_PRO is not set — paid plan checkout will fail");
}

export const PLANS = {
  free: { label: "Free", credits: 10, price: 0, stripePriceId: null },
  basic: { label: "Basic", credits: 100, price: 9, stripePriceId: process.env.STRIPE_PRICE_BASIC ?? "" },
  pro: { label: "Pro", credits: 500, price: 29, stripePriceId: process.env.STRIPE_PRICE_PRO ?? "" },
} as const;

export type PlanId = keyof typeof PLANS;

export function planIdFromPriceId(priceId: string): PlanId | null {
  if (!priceId) return null;
  for (const [id, config] of Object.entries(PLANS)) {
    if (config.stripePriceId && config.stripePriceId === priceId) return id as PlanId;
  }
  return null;
}
