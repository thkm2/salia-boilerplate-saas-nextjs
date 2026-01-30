import type { PlanId } from "@/lib/plans";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Cta {
	label: string;
	href: string;
}

interface HeroContent {
	badge: string;
	headline: string;
	headlineHighlight: string;
	subheadline: string;
	primaryCta: Cta;
	secondaryCta: Cta;
	trustedByText: string;
}

interface LogoCloudContent {
	title: string;
	logos: { name: string }[];
}

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

interface FeaturesContent {
	badge: string;
	title: string;
	description: string;
	features: Feature[];
	benefits: Benefit[];
}

interface CtaSectionContent {
	title: string;
	description: string;
	primaryCta: Cta;
	secondaryCta?: Cta;
}

interface PricingFeature {
	text: string;
	included: boolean;
}

interface PricingContent {
	badge: string;
	title: string;
	description: string;
	popularPlan: PlanId;
	ctaText: string;
	plans: Record<PlanId, { features: PricingFeature[] }>;
}

interface Testimonial {
	quote: string;
	name: string;
	role: string;
	avatarFallback: string;
}

interface TestimonialsContent {
	badge: string;
	title: string;
	description: string;
	testimonials: Testimonial[];
}

interface FaqItem {
	question: string;
	answer: string;
	category?: string;
}

interface FaqContent {
	title: string;
	description: string;
	items: FaqItem[];
	contactInfo?: {
		title: string;
		description?: string;
		buttonText: string;
		onContactHref?: string;
	};
}

export interface LandingContent {
	hero: HeroContent;
	logoCloud: LogoCloudContent;
	features: FeaturesContent;
	midCta: CtaSectionContent;
	pricing: PricingContent;
	testimonials: TestimonialsContent;
	faq: FaqContent;
	finalCta: CtaSectionContent;
}

// ─── Content ─────────────────────────────────────────────────────────────────
// Edit this object to customize the entire landing page.

export const landingContent: LandingContent = {
	hero: {
		badge: "Now in Public Beta",
		headline: "The all-in-one platform to",
		headlineHighlight: "ship faster",
		subheadline:
			"Stop juggling tools. Salia gives you authentication, billing, and analytics in a single boilerplate so you can focus on what matters — your product.",
		primaryCta: { label: "Get started for free", href: "/auth" },
		secondaryCta: { label: "See pricing", href: "#pricing" },
		trustedByText: "Trusted by 500+ developers worldwide",
	},

	logoCloud: {
		title: "Backed by teams who ship",
		logos: [
			{ name: "Vercel" },
			{ name: "Stripe" },
			{ name: "Linear" },
			{ name: "Notion" },
			{ name: "Figma" },
		],
	},

	features: {
		badge: "Features",
		title: "Everything you need to launch",
		description:
			"Built on modern foundations so you never have to worry about infrastructure again.",
		features: [
			{
				icon: "Zap",
				title: "Lightning Fast",
				description:
					"Server components and edge-ready by default. Your users feel the difference.",
			},
			{
				icon: "BarChart3",
				title: "Built-in Analytics",
				description:
					"Track usage, credits, and growth with a dashboard that just works.",
			},
			{
				icon: "Shield",
				title: "Secure by Default",
				description:
					"Auth, roles, and feature flags out of the box. SOC-2 patterns included.",
			},
		],
		benefits: [
			{
				title: "Authentication that just works",
				description:
					"Google OAuth and Magic Links configured out of the box. Role-based access, session management, and protected routes — all wired up.",
				bullets: [
					"Google OAuth + Magic Link ready",
					"Role-based access control",
					"Protected routes & middleware",
				],
				imagePosition: "right",
			},
			{
				title: "Credits & billing, simplified",
				description:
					"A transactional credits system with full audit trail. Pair it with Stripe and start monetizing on day one.",
				bullets: [
					"Transactional credit ledger",
					"Three-tier plan system",
					"Stripe-ready architecture",
				],
				imagePosition: "left",
			},
		],
	},

	midCta: {
		title: "Ready to stop reinventing the wheel?",
		description:
			"Join hundreds of developers shipping faster with Salia. Free tier available — no credit card required.",
		primaryCta: { label: "Start building now", href: "/auth" },
		secondaryCta: { label: "View documentation", href: "#features" },
	},

	pricing: {
		badge: "Pricing",
		title: "Simple, transparent pricing",
		description:
			"Start free and scale as you grow. No surprise fees, ever.",
		popularPlan: "basic",
		ctaText: "Get started",
		plans: {
			free: {
				features: [
					{ text: "10 credits per month", included: true },
					{ text: "Basic analytics", included: true },
					{ text: "Community support", included: true },
					{ text: "Priority support", included: false },
					{ text: "Custom integrations", included: false },
				],
			},
			basic: {
				features: [
					{ text: "100 credits per month", included: true },
					{ text: "Advanced analytics", included: true },
					{ text: "Email support", included: true },
					{ text: "Priority support", included: true },
					{ text: "Custom integrations", included: false },
				],
			},
			pro: {
				features: [
					{ text: "500 credits per month", included: true },
					{ text: "Full analytics suite", included: true },
					{ text: "Dedicated support", included: true },
					{ text: "Priority support", included: true },
					{ text: "Custom integrations", included: true },
				],
			},
		},
	},

	testimonials: {
		badge: "Testimonials",
		title: "Loved by developers",
		description: "See what people are saying about building with Salia.",
		testimonials: [
			{
				quote:
					"Salia saved us weeks of setup. Auth, billing, and roles were ready on day one. We launched our MVP in half the time.",
				name: "Sarah Chen",
				role: "CTO at LaunchPad",
				avatarFallback: "SC",
			},
			{
				quote:
					"The credits system is exactly what we needed. Clean architecture, full audit trail, and it just works with Stripe.",
				name: "Marcus Rodriguez",
				role: "Founder of DevTools Co",
				avatarFallback: "MR",
			},
			{
				quote:
					"Finally a boilerplate that doesn't feel like a boilerplate. The code is clean, well-structured, and easy to extend.",
				name: "Emily Park",
				role: "Senior Engineer at ScaleUp",
				avatarFallback: "EP",
			},
		],
	},

	faq: {
		title: "Frequently asked questions",
		description:
			"Everything you need to know about Salia. Can't find what you're looking for? Reach out.",
		items: [
			{
				question: "Is Salia really free to start?",
				answer:
					"Yes. The Free plan gives you 10 credits per month and access to all core features. No credit card required.",
				category: "Pricing",
			},
			{
				question: "What's included in the boilerplate?",
				answer:
					"Authentication (Google OAuth + Magic Links), role-based access, credits system, feature flags, admin dashboard, and a full landing page — all built with Next.js 16, Drizzle ORM, and Tailwind CSS 4.",
				category: "Product",
			},
			{
				question: "Can I use Salia for commercial projects?",
				answer:
					"Absolutely. Salia is licensed for commercial use. Build and ship as many projects as you want.",
				category: "Licensing",
			},
			{
				question: "How does the credits system work?",
				answer:
					"Credits are transactional with a full audit trail. Each operation records a +/- entry. Plans allocate monthly credits, and you can grant additional credits via the admin panel.",
				category: "Product",
			},
			{
				question: "Do you support Stripe?",
				answer:
					"The architecture is Stripe-ready. The billing integration is designed to drop in with minimal configuration once you add your Stripe keys.",
				category: "Integrations",
			},
			{
				question: "What database does Salia use?",
				answer:
					"Salia uses Neon PostgreSQL with Drizzle ORM. It's serverless, scales automatically, and has an excellent developer experience.",
				category: "Technical",
			},
		],
		contactInfo: {
			title: "Still have questions?",
			description: "We're here to help. Reach out and we'll get back to you.",
			buttonText: "Contact us",
			onContactHref: "/contact",
		},
	},

	finalCta: {
		title: "Start building your SaaS today",
		description:
			"Everything you need to go from idea to production. Free plan available.",
		primaryCta: { label: "Get started for free", href: "/auth" },
	},
};
