import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CtaSectionProps {
	title: string;
	description: string;
	primaryCta: { label: string; href: string };
	secondaryCta?: { label: string; href: string };
	variant?: "default" | "highlight";
}

export function CtaSection({
	title,
	description,
	primaryCta,
	secondaryCta,
	variant = "default",
}: CtaSectionProps) {
	const isHighlight = variant === "highlight";

	return (
		<section className={cn("py-24 lg:py-32", isHighlight && "border-t")}>
			<div
				className={cn(
					"mx-auto max-w-6xl px-6 lg:px-12",
					isHighlight && "flex items-center justify-center",
				)}
			>
				<div
					className={cn(
						"text-center",
						isHighlight
							? "w-full rounded-3xl bg-foreground px-8 py-16 text-background sm:px-16 sm:py-20"
							: "mx-auto max-w-2xl",
					)}
				>
					<h2
						className={cn(
							"text-3xl font-bold tracking-tight sm:text-4xl",
							isHighlight && "text-background",
						)}
					>
						{title}
					</h2>
					<p
						className={cn(
							"mx-auto mt-4 max-w-lg text-base leading-relaxed sm:text-lg",
							isHighlight ? "text-background/60" : "text-muted-foreground",
						)}
					>
						{description}
					</p>
					<div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
						<Button
							asChild
							size="lg"
							variant={isHighlight ? "secondary" : "default"}
							className={cn(
								"w-full sm:w-auto px-8",
								isHighlight &&
									"bg-background text-foreground hover:bg-background/90",
							)}
						>
							<Link href={primaryCta.href}>
								{primaryCta.label}
								<ArrowRight className="ml-2 size-4" />
							</Link>
						</Button>
						{secondaryCta && (
							<Button
								asChild
								size="lg"
								variant="ghost"
								className={cn(
									"w-full sm:w-auto",
									isHighlight
										? "text-background/70 hover:text-background hover:bg-background/10"
										: "text-muted-foreground",
								)}
							>
								<Link href={secondaryCta.href}>{secondaryCta.label}</Link>
							</Button>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
