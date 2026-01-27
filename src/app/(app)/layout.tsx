import { requireAuth } from "@/lib/auth/guards";

export default async function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Require authentication - redirects to /auth if not logged in
	await requireAuth();

	return <>{children}</>;
}
