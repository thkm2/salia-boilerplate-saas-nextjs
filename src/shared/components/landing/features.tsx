import {
	Zap,
	BarChart3,
	Shield,
	Layers,
	Globe,
	Lock,
	Check,
	type LucideIcon,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

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
		<section id="features" className="py-24 lg:py-32 border-t bg-muted/30">
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

				{/* Feature cards — clean bordered grid */}
				<div className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
					{features.map((feature) => {
						const Icon = iconMap[feature.icon] ?? Zap;
						return (
							<div
								key={feature.title}
								className="flex flex-col gap-3 bg-background p-8 sm:p-10"
							>
								<Icon className="size-5 text-foreground" strokeWidth={1.5} />
								<h3 className="text-base font-semibold">{feature.title}</h3>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{feature.description}
								</p>
							</div>
						);
					})}
				</div>

				{/* Alternating benefit blocks */}
				<div className="mt-28 space-y-28">
					{benefits.map((benefit, index) => {
						const isImageLeft = benefit.imagePosition === "left";
						return (
							<div
								key={index}
								className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20"
							>
								{/* Image placeholder with inner grain */}
								<div
									className={`${isImageLeft ? "lg:order-first" : "lg:order-last"} order-last`}
								>
									<div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-muted/50">
										<div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,currentColor_8px,currentColor_9px)] text-border/30" />
									</div>
								</div>

								{/* Text content */}
								<div
									className={`${isImageLeft ? "lg:order-last" : "lg:order-first"}`}
								>
									<h3 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-[2rem]">
										{benefit.title}
									</h3>
									<p className="mt-4 leading-relaxed text-muted-foreground">
										{benefit.description}
									</p>
									<ul className="mt-8 space-y-4">
										{benefit.bullets.map((bullet) => (
											<li key={bullet} className="flex items-start gap-3">
												<span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border bg-background">
													<Check className="size-3 text-foreground" />
												</span>
												<span className="text-sm leading-snug text-foreground/80">
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
