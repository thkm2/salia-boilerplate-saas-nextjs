import { Badge } from "@/shared/components/ui/badge";
import {
	Avatar,
	AvatarFallback,
} from "@/shared/components/ui/avatar";

interface Testimonial {
	quote: string;
	name: string;
	role: string;
	avatarFallback: string;
}

interface TestimonialsProps {
	badge: string;
	title: string;
	description: string;
	testimonials: Testimonial[];
}

export function Testimonials({
	badge,
	title,
	description,
	testimonials,
}: TestimonialsProps) {
	return (
		<section className="py-24 lg:py-32 border-t bg-muted/30">
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

				{/* Testimonial cards */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{testimonials.map((testimonial) => (
						<div
							key={testimonial.name}
							className="flex flex-col justify-between rounded-2xl border bg-card p-8"
						>
							<blockquote className="text-[0.9375rem] leading-relaxed text-foreground/90">
								&ldquo;{testimonial.quote}&rdquo;
							</blockquote>
							<div className="mt-8 flex items-center gap-3 border-t pt-6">
								<Avatar size="sm">
									<AvatarFallback className="text-[10px]">
										{testimonial.avatarFallback}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="text-sm font-medium leading-none">
										{testimonial.name}
									</p>
									<p className="mt-1 text-xs text-muted-foreground">
										{testimonial.role}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
