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
		<section
			className={cn(
				"py-20 lg:py-28",
				isHighlight && "bg-primary text-primary-foreground",
			)}
		>
			<div className="mx-auto max-w-3xl px-6 lg:px-12 text-center">
				<h2
					className={cn(
						"text-3xl font-bold tracking-tight sm:text-4xl",
						!isHighlight && "text-foreground",
					)}
				>
					{title}
				</h2>
				<p
					className={cn(
						"mt-4 text-lg leading-relaxed",
						isHighlight
							? "text-primary-foreground/80"
							: "text-muted-foreground",
					)}
				>
					{description}
				</p>
				<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
					<Button
						asChild
						size="lg"
						variant={isHighlight ? "secondary" : "default"}
						className="w-full sm:w-auto"
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
							variant={isHighlight ? "ghost" : "outline"}
							className={cn(
								"w-full sm:w-auto",
								isHighlight &&
									"text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10",
							)}
						>
							<Link href={secondaryCta.href}>{secondaryCta.label}</Link>
						</Button>
					)}
				</div>
			</div>
		</section>
	);
}
