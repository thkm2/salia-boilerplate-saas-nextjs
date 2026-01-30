import Link from "next/link";
import { PLANS, type PlanId } from "@/lib/plans";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/shared/components/ui/separator";

interface PricingFeature {
	text: string;
	included: boolean;
}

interface PricingProps {
	badge: string;
	title: string;
	description: string;
	popularPlan: PlanId;
	ctaText: string;
	plans: Record<PlanId, { features: PricingFeature[] }>;
}

const planOrder: PlanId[] = ["free", "basic", "pro"];

export function Pricing({
	badge,
	title,
	description,
	popularPlan,
	ctaText,
	plans,
}: PricingProps) {
	return (
		<section id="pricing" className="py-24 lg:py-32">
			<div className="mx-auto max-w-6xl px-6 lg:px-12">
				{/* Section header */}
				<div className="mx-auto max-w-2xl text-center mb-20">
					<Badge variant="outline" className="mb-4">
						{badge}
					</Badge>
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
						{title}
					</h2>
					<p className="mt-4 text-muted-foreground sm:text-lg">{description}</p>
				</div>

				{/* Pricing cards */}
				<div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3 lg:gap-0">
					{planOrder.map((planId) => {
						const plan = PLANS[planId];
						const config = plans[planId];
						const isPopular = planId === popularPlan;

						return (
							<div
								key={planId}
								className={cn(
									"relative flex flex-col rounded-2xl border bg-card p-8 lg:p-10",
									isPopular
										? "z-10 border-foreground shadow-xl lg:-my-4"
										: "lg:first:rounded-r-none lg:last:rounded-l-none",
								)}
							>
								{isPopular && (
									<Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
										Most popular
									</Badge>
								)}

								{/* Plan header */}
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										{plan.label}
									</p>
									<div className="mt-4 flex items-baseline gap-1">
										<span className="text-5xl font-bold tracking-tight">
											{plan.price === 0 ? "$0" : `$${plan.price}`}
										</span>
										<span className="text-sm text-muted-foreground">/mo</span>
									</div>
									<p className="mt-2 text-sm text-muted-foreground">
										{plan.credits} credits included
									</p>
								</div>

								<Separator className="my-8" />

								{/* Feature list */}
								<ul className="flex-1 space-y-4">
									{config.features.map((feature) => (
										<li
											key={feature.text}
											className="flex items-start gap-3"
										>
											{feature.included ? (
												<span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-foreground">
													<Check className="size-2.5 text-background" />
												</span>
											) : (
												<X className="mt-0.5 size-4 shrink-0 text-muted-foreground/30" />
											)}
											<span
												className={cn(
													"text-sm leading-snug",
													!feature.included && "text-muted-foreground/50",
												)}
											>
												{feature.text}
											</span>
										</li>
									))}
								</ul>

								{/* CTA */}
								<Button
									asChild
									variant={isPopular ? "default" : "outline"}
									className="mt-10 w-full"
								>
									<Link href="/auth">{ctaText}</Link>
								</Button>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
