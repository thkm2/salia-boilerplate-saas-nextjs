import Link from "next/link";
import { CircleDashed } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Logo = () => {
	return (
		<div className="flex items-center gap-2.5">
			<CircleDashed size={24} strokeWidth={3.5} />
			<h2 className="text-[28px] font-semibold">Salia</h2>
		</div>
	);
};

export function Footer() {
	const currentYear = new Date().getFullYear();

	const footerLinks = {
		company: [
			{ name: "Home", href: "/" },
			{ name: "Contact", href: "/contact" },
		],
		legal: [
			{ name: "Privacy Policy", href: "/privacy" },
			{ name: "Terms of Service", href: "/terms" },
		],
	};

	return (
		<footer className="w-full border-t bg-background mt-20">
			<div className="container mx-auto px-6 lg:px-12">
				<div className="py-12 lg:py-16">
					<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
						{/* Logo and Description */}
						<div className="col-span-2 md:col-span-4 lg:col-span-1">
							<Logo />
							<p className="mt-4 text-sm text-muted-foreground">
								Salia boilerplate SaaS Next.js
							</p>
						</div>
						<div className="max-sm:hidden"></div>

						{/* Company Links */}
						<div>
							<h3 className="font-semibold mb-4">Company</h3>
							<ul className="space-y-3">
								{footerLinks.company.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Legal Links */}
						<div>
							<h3 className="font-semibold mb-4">Legal</h3>
							<ul className="space-y-3">
								{footerLinks.legal.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				<Separator />

				{/* Bottom Bar */}
				<div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
					<p className="text-sm text-muted-foreground">© {currentYear} Salia</p>
				</div>
			</div>
		</footer>
	);
}
