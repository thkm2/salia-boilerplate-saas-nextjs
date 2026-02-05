import { siteConfig } from "@/lib/site.config";

// ─── Types ──────────────────────────────────────────────────────────────────

interface FaqItem {
	question: string;
	answer: string;
}

interface SoftwareApplicationProps {
	name?: string;
	description?: string;
	applicationCategory?: string;
	operatingSystem?: string;
	offers?: {
		price: string;
		priceCurrency: string;
	};
}

// ─── JSON-LD Wrapper ────────────────────────────────────────────────────────

function JsonLd({ data }: { data: object }) {
	return (
		<script
			type="application/ld+json"
			suppressHydrationWarning
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}

// ─── Organization JSON-LD ───────────────────────────────────────────────────
// Add to root layout for company info

export function OrganizationJsonLd() {
	const data = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: siteConfig.organization.name,
		url: siteConfig.url,
		logo: `${siteConfig.url}${siteConfig.organization.logo}`,
		sameAs: siteConfig.twitterHandle
			? [`https://twitter.com/${siteConfig.twitterHandle.replace("@", "")}`]
			: [],
	};

	return <JsonLd data={data} />;
}

// ─── Website JSON-LD ────────────────────────────────────────────────────────
// Add to root layout for site info

export function WebsiteJsonLd() {
	const data = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: siteConfig.name,
		url: siteConfig.url,
		description: siteConfig.description,
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};

	return <JsonLd data={data} />;
}

// ─── FAQ JSON-LD ────────────────────────────────────────────────────────────
// Add to pages with FAQ sections

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
	const data = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: item.answer,
			},
		})),
	};

	return <JsonLd data={data} />;
}

// ─── Software Application JSON-LD ───────────────────────────────────────────
// Add to landing page for SaaS products

export function SoftwareApplicationJsonLd({
	name = siteConfig.name,
	description = siteConfig.description,
	applicationCategory = "BusinessApplication",
	operatingSystem = "Web",
	offers,
}: SoftwareApplicationProps = {}) {
	const data = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name,
		description,
		applicationCategory,
		operatingSystem,
		...(offers && {
			offers: {
				"@type": "Offer",
				price: offers.price,
				priceCurrency: offers.priceCurrency,
			},
		}),
	};

	return <JsonLd data={data} />;
}
