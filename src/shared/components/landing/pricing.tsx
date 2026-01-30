import Link from "next/link";
import { PLANS, type PlanId } from "@/lib/plans";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/shared/components/ui/card";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
		<section id="pricing" className="py-20 lg:py-28">
			<div className="mx-auto max-w-6xl px-6 lg:px-12">
				{/* Section header */}
				<div className="mx-auto max-w-2xl text-center mb-16">
					<Badge variant="outline" className="mb-4">
						{badge}
					</Badge>
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						{title}
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">{description}</p>
				</div>

				{/* Pricing cards */}
				<div className="grid gap-8 lg:grid-cols-3 items-start">
					{planOrder.map((planId) => {
						const plan = PLANS[planId];
						const config = plans[planId];
						const isPopular = planId === popularPlan;

						return (
							<Card
								key={planId}
								className={cn(
									"relative",
									isPopular &&
										"border-primary shadow-lg lg:scale-105",
								)}
							>
								{isPopular && (
									<div className="absolute -top-3 left-1/2 -translate-x-1/2">
										<Badge>Most popular</Badge>
									</div>
								)}

								<CardHeader className="text-center">
									<CardTitle className="text-xl">{plan.label}</CardTitle>
									<CardDescription>
										{plan.credits} credits / month
									</CardDescription>
									<div className="mt-4">
										<span className="text-4xl font-bold">
											{plan.price === 0 ? "Free" : `$${plan.price}`}
										</span>
										{plan.price > 0 && (
											<span className="text-muted-foreground ml-1">/mo</span>
										)}
									</div>
								</CardHeader>

								<CardContent>
									<ul className="space-y-3">
										{config.features.map((feature) => (
											<li key={feature.text} className="flex items-center gap-3">
												{feature.included ? (
													<Check className="size-4 text-primary shrink-0" />
												) : (
													<X className="size-4 text-muted-foreground/40 shrink-0" />
												)}
												<span
													className={cn(
														"text-sm",
														!feature.included && "text-muted-foreground/60",
													)}
												>
													{feature.text}
												</span>
											</li>
										))}
									</ul>
								</CardContent>

								<CardFooter>
									<Button
										asChild
										variant={isPopular ? "default" : "outline"}
										className="w-full"
									>
										<Link href="/auth">{ctaText}</Link>
									</Button>
								</CardFooter>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
}
