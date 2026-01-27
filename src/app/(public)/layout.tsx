import { getSession } from "@/lib/auth/guards";
import { redirect } from "next/navigation";

export default async function PublicLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getSession();

	// If user is already authenticated, redirect to dashboard
	if (session) {
		redirect("/dashboard");
	}

	return <>{children}</>;
}
