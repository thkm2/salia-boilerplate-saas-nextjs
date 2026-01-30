import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";

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
		<section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
			<div className="mx-auto max-w-6xl px-6 lg:px-12">
				<div className="mx-auto max-w-3xl text-center">
					<Badge variant="outline" className="mb-6">
						{badge}
					</Badge>

					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
						{headline}{" "}
						<span className="bg-gradient-to-r from-primary via-primary/70 to-primary bg-clip-text text-transparent">
							{headlineHighlight}
						</span>
					</h1>

					<p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
						{subheadline}
					</p>

					<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
						<Button asChild size="lg" className="w-full sm:w-auto">
							<Link href={primaryCta.href}>
								{primaryCta.label}
								<ArrowRight className="ml-2 size-4" />
							</Link>
						</Button>
						<Button
							asChild
							size="lg"
							variant="outline"
							className="w-full sm:w-auto"
						>
							<Link href={secondaryCta.href}>{secondaryCta.label}</Link>
						</Button>
					</div>

					<p className="mt-12 text-sm text-muted-foreground">
						{trustedByText}
					</p>
				</div>
			</div>
		</section>
	);
}
