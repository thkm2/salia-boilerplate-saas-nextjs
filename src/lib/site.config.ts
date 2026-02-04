// ─── Site Configuration ─────────────────────────────────────────────────────
// This is the ONLY file you need to edit per project.
// All SEO (sitemap, robots, metadata, JSON-LD) reads from this config.

export const siteConfig = {
	// === MODIFY THESE VALUES PER PROJECT ===
	name: "Salia",
	description:
		"The all-in-one SaaS boilerplate with authentication, billing, and analytics. Ship faster with Next.js 16, Drizzle ORM, and Tailwind CSS 4.",
	url: "https://salia.dev",

	// Open Graph (social media preview)
	ogImage: "/og-image.png", // 1200x630px in /public

	// Twitter (optional)
	twitterHandle: "@salia_dev",

	// Organization info (for JSON-LD)
	organization: {
		name: "Salia",
		logo: "/logo.png", // 512x512px in /public
	},

	// Locale
	locale: "en_US",

	// Keywords for SEO
	keywords: [
		"SaaS boilerplate",
		"Next.js template",
		"authentication",
		"billing",
		"credits system",
		"Drizzle ORM",
		"Tailwind CSS",
	],
} as const;

export type SiteConfig = typeof siteConfig;
