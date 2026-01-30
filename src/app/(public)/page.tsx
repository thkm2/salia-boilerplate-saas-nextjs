import { Nav } from "@/shared/components/landing/nav";
import { Hero } from "@/shared/components/landing/hero";
import { Features } from "@/shared/components/landing/features";
import { Pricing } from "@/shared/components/landing/pricing";
import { Testimonials } from "@/shared/components/landing/testimonials";
import { CtaSection } from "@/shared/components/landing/cta-section";
import { FaqSectionWithCategories } from "@/shared/components/faq-categories";
import { Footer } from "@/shared/components/landing/footer";
import { landingContent } from "./landing.config";

const menuItems = [
	{ name: "Features", href: "#features" },
	{ name: "Pricing", href: "#pricing" },
	{ name: "FAQ", href: "#faq" },
];

const LandingPage = () => {
	return (
		<>
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
