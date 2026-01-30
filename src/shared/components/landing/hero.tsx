import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroProps {
	badge: string;
	headline: string;
	headlineHighlight: string;
	subheadline: string;
	primaryCta: { label: string; href: string };
	secondaryCta: { label: string; href: string };
	trustedByText: string;
}

export function Hero({
	badge,
	headline,
	headlineHighlight,
	subheadline,
	primaryCta,
	secondaryCta,
	trustedByText,
}: HeroProps) {
	return (
		<section className="relative overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
			{/* Subtle radial glow behind hero */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 size-[800px] rounded-full bg-primary/[0.03] blur-3xl" />
			</div>

			<div className="relative mx-auto max-w-6xl px-6 lg:px-12">
				<div className="mx-auto max-w-3xl text-center">
					<div className="animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both">
						<Badge variant="outline" className="mb-8 gap-1.5 px-3 py-1 text-xs">
							<Sparkles className="size-3" />
							{badge}
						</Badge>
					</div>

					<h1 className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both text-[2.5rem] font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
						{headline}
						<br />
						<span className="relative inline-block mt-1">
							<span className="relative z-10">{headlineHighlight}</span>
							<span
								aria-hidden="true"
								className="absolute -bottom-1 left-0 h-3 w-full bg-primary/10 -rotate-1 rounded-sm"
							/>
						</span>
					</h1>

					<p className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
						{subheadline}
					</p>

					<div className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-[450ms] fill-mode-both mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
						<Button asChild size="lg" className="w-full sm:w-auto px-8">
							<Link href={primaryCta.href}>
								{primaryCta.label}
								<ArrowRight className="ml-2 size-4" />
							</Link>
						</Button>
						<Button
							asChild
							size="lg"
							variant="ghost"
							className="w-full sm:w-auto text-muted-foreground"
						>
							<Link href={secondaryCta.href}>{secondaryCta.label}</Link>
						</Button>
					</div>

					{/* Trusted by — with a subtle divider */}
					<div className="animate-in fade-in duration-700 delay-700 fill-mode-both mt-16 flex flex-col items-center gap-3">
						<div className="h-px w-12 bg-border" />
						<p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
							{trustedByText}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
