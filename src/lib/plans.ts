export const PLANS = {
  free: { label: "Free", credits: 10, price: 0 },
  basic: { label: "Basic", credits: 100, price: 9 },
  pro: { label: "Pro", credits: 500, price: 29 },
} as const;

export type PlanId = keyof typeof PLANS;
