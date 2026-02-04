import { Suspense } from "react";
import { requireAuth } from "@/lib/auth/guards";
import { PLANS, type PlanId } from "@/lib/plans";
import { CurrentPlanCard } from "./_components/current-plan-card";
import { PlanCard } from "./_components/plan-card";
import { CheckoutResult } from "./_components/checkout-result";
import { CreditCard } from "lucide-react";

export default async function PlansPage() {
	const session = await requireAuth();
	const { plan, credits, stripeSubscriptionId, paymentFailed, creditsResetAt } =
		session.user;

	return (
		<div className="space-y-8">
			<Suspense>
				<CheckoutResult />
			</Suspense>

			{/* Header */}
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 ring-1 ring-foreground/10">
					<CreditCard className="h-5 w-5 text-foreground/70" />
				</div>
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">
						Plans & Billing
					</h1>
					<p className="text-sm text-muted-foreground">
						Manage your subscription and credits
					</p>
				</div>
			</div>

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
