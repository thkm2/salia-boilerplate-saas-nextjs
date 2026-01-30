import {
	Zap,
	BarChart3,
	Shield,
	Layers,
	Globe,
	Lock,
	type LucideIcon,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/shared/components/ui/card";
import { Check } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
	Zap,
	BarChart3,
	Shield,
	Layers,
	Globe,
	Lock,
};

interface Feature {
	icon: string;
	title: string;
	description: string;
}

interface Benefit {
	title: string;
	description: string;
	bullets: string[];
	imagePosition: "left" | "right";
}

interface FeaturesProps {
	badge: string;
	title: string;
	description: string;
	features: Feature[];
	benefits: Benefit[];
}

export function Features({
	badge,
	title,
	description,
	features,
	benefits,
}: FeaturesProps) {
	return (
		<section id="features" className="py-20 lg:py-28">
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

				{/* Feature cards grid */}
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{features.map((feature) => {
						const Icon = iconMap[feature.icon] ?? Zap;
						return (
							<Card key={feature.title} className="relative">
								<CardHeader>
									<div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
										<Icon className="size-5 text-primary" />
									</div>
									<CardTitle className="text-lg">{feature.title}</CardTitle>
									<CardDescription className="text-sm leading-relaxed">
										{feature.description}
									</CardDescription>
								</CardHeader>
							</Card>
						);
					})}
				</div>

				{/* Alternating benefit blocks */}
				<div className="mt-24 space-y-24">
					{benefits.map((benefit, index) => {
						const isImageLeft = benefit.imagePosition === "left";
						return (
							<div
								key={index}
								className="grid items-center gap-12 lg:grid-cols-2"
							>
								{/* Image placeholder */}
								<div
									className={`${isImageLeft ? "lg:order-first" : "lg:order-last"} order-last`}
								>
									<div className="aspect-video w-full rounded-xl border bg-muted/50" />
								</div>

								{/* Text content */}
								<div
									className={`${isImageLeft ? "lg:order-last" : "lg:order-first"}`}
								>
									<h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
										{benefit.title}
									</h3>
									<p className="mt-4 text-muted-foreground leading-relaxed">
										{benefit.description}
									</p>
									<ul className="mt-6 space-y-3">
										{benefit.bullets.map((bullet) => (
											<li key={bullet} className="flex items-center gap-3">
												<div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
													<Check className="size-3 text-primary" />
												</div>
												<span className="text-sm text-muted-foreground">
													{bullet}
												</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
