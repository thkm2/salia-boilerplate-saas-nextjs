import { Nav } from "@/shared/components/landing/nav";
import { Hero } from "@/shared/components/landing/hero";
import { Features } from "@/shared/components/landing/features";
import { Pricing } from "@/shared/components/landing/pricing";
import { Testimonials } from "@/shared/components/landing/testimonials";
import { CtaSection } from "@/shared/components/landing/cta-section";
import { FaqSectionWithCategories } from "@/shared/components/faq-categories";
import { Footer } from "@/shared/components/landing/footer";
import { landingContent } from "./landing.config";
import { createMetadata } from "@/lib/seo";
import {
	FaqJsonLd,
	SoftwareApplicationJsonLd,
} from "@/shared/components/json-ld";

export const metadata = createMetadata({
	title: "SaaS Boilerplate for Next.js",
	description:
		"Ship faster with authentication, billing, and analytics built-in. The all-in-one Next.js 16 boilerplate.",
	path: "/",
});

const menuItems = [
	{ name: "Features", href: "#features" },
	{ name: "Pricing", href: "#pricing" },
	{ name: "FAQ", href: "#faq" },
];

const LandingPage = () => {
	return (
		<>
			<FaqJsonLd items={landingContent.faq.items} />
			<SoftwareApplicationJsonLd
				offers={{ price: "0", priceCurrency: "USD" }}
			/>
			<Nav menuItems={menuItems} />

			<Hero {...landingContent.hero} />

			<Features {...landingContent.features} />

			<Testimonials {...landingContent.testimonials} />

			<Pricing {...landingContent.pricing} />

			<section id="faq" className="py-24 lg:py-32 border-t">
				<div className="mx-auto flex max-w-6xl justify-center px-6 lg:px-12">
					<FaqSectionWithCategories {...landingContent.faq} />
				</div>
			</section>

			<CtaSection {...landingContent.finalCta} variant="highlight" />

			<Footer />
		</>
	);
};

export default LandingPage;
