import { MobileNavbar } from "./_components/mobile-navbar";

export default function MobileNavLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-svh pb-20 md:pb-24">
			<main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
			<MobileNavbar />
		</div>
	);
}
