import { Suspense } from "react";
import { requireAuth } from "@/lib/auth/guards";
import { PLANS, type PlanId } from "@/lib/plans";
import { CurrentPlanCard } from "./_components/current-plan-card";
import { PlanCard } from "./_components/plan-card";
import { CheckoutResult } from "./_components/checkout-result";
import { PageHeader } from "@/shared/components/ui/page-header";
import { CreditCard } from "lucide-react";

export default async function PlansPage() {
	const session = await requireAuth();
	const { plan, credits, stripeSubscriptionId, paymentFailed, creditsResetAt } =
		session.user;

	return (
		<div className="space-y-6">
			<Suspense>
				<CheckoutResult />
			</Suspense>

			<PageHeader
				icon={CreditCard}
				title="Plans & Billing"
				description="Manage your subscription and credits"
			/>

			{/* Current Plan Details */}
			<CurrentPlanCard
				plan={plan}
				credits={credits}
				hasSubscription={!!stripeSubscriptionId}
				paymentFailed={paymentFailed}
				creditsResetAt={creditsResetAt}
			/>

			{/* Available Plans */}
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
