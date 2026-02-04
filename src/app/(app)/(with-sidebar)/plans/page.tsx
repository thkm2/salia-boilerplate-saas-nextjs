import { Suspense } from "react";
import { requireAuth } from "@/lib/auth/guards";
import { PLANS, type PlanId } from "@/lib/plans";
import { CurrentPlanCard } from "./_components/current-plan-card";
import { PlanCard } from "./_components/plan-card";
import { CheckoutResult } from "./_components/checkout-result";

export default async function PlansPage() {
  const session = await requireAuth();
  const { plan, credits, stripeSubscriptionId, paymentFailed, creditsResetAt } = session.user;

  return (
    <div className="space-y-8">
      <Suspense>
        <CheckoutResult />
      </Suspense>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Plans</h1>
        <p className="text-muted-foreground">
          Manage your subscription and credits.
        </p>
      </div>

      <CurrentPlanCard plan={plan} credits={credits} hasSubscription={!!stripeSubscriptionId} paymentFailed={paymentFailed} creditsResetAt={creditsResetAt} />

      <div>
        <h2 className="text-lg font-semibold mb-4">Available plans</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.entries(PLANS) as [PlanId, (typeof PLANS)[PlanId]][]).map(
            ([id, config]) => (
              <PlanCard
                key={id}
                planId={id}
                label={config.label}
                price={config.price}
                credits={config.credits}
                isCurrent={plan === id}
                isPopular={id === "basic"}
                currentPlan={plan}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
