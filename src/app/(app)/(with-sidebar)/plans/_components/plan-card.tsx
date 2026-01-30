import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Check } from "lucide-react";
import type { PlanId } from "@/lib/plans";

const PLAN_FEATURES: Record<PlanId, string[]> = {
  free: [
    "10 credits / month",
    "Core features",
    "Community support",
  ],
  basic: [
    "100 credits / month",
    "All features",
    "Email support",
    "Unlimited exports",
  ],
  pro: [
    "500 credits / month",
    "All features",
    "Priority support",
    "Unlimited exports",
    "API access",
    "Advanced integrations",
  ],
};

export function PlanCard({
  planId,
  label,
  price,
  credits,
  isCurrent,
  isPopular,
}: {
  planId: PlanId;
  label: string;
  price: number;
  credits: number;
  isCurrent: boolean;
  isPopular?: boolean;
}) {
  const features = PLAN_FEATURES[planId];

  return (
    <div
      className={`relative rounded-lg border bg-card p-6 flex flex-col ${
        isPopular ? "border-primary" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="shadow-sm">Most popular</Badge>
        </div>
      )}
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-lg font-semibold">{label}</h3>
        {isCurrent && <Badge variant="outline">Current plan</Badge>}
      </div>
      <div className="mb-4">
        <span className="text-3xl font-bold">${price}</span>
        <span className="text-muted-foreground text-sm"> / month</span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {credits} credits included
      </p>
      <ul className="space-y-2 mb-6 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm">
            <Check className="size-4 text-primary shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      {isCurrent ? (
        <Button disabled variant="outline" className="w-full">
          Current plan
        </Button>
      ) : (
        <Button disabled={!isPopular} variant={isPopular ? "default" : "outline"} className="w-full">
          Choose this plan
        </Button>
      )}
    </div>
  );
}
