import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
	Avatar,
	AvatarFallback,
} from "@/shared/components/ui/avatar";
import { Quote } from "lucide-react";

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
		<section className="py-20 lg:py-28">
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

				{/* Testimonial cards */}
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{testimonials.map((testimonial) => (
						<Card key={testimonial.name}>
							<CardContent className="pt-0">
								<Quote className="size-8 text-primary/20 mb-4" />
								<blockquote className="text-sm leading-relaxed text-foreground">
									&ldquo;{testimonial.quote}&rdquo;
								</blockquote>
								<div className="mt-6 flex items-center gap-3">
									<Avatar>
										<AvatarFallback>
											{testimonial.avatarFallback}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-sm font-medium">{testimonial.name}</p>
										<p className="text-xs text-muted-foreground">
											{testimonial.role}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
