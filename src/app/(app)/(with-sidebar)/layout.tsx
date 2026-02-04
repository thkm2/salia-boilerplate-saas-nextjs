import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "./_side-bar/side-bar";
import { SidebarInset } from "@/shared/components/ui/sidebar";
import NavTrigger from "@/shared/components/sidebar/nav-trigger";
import { getSession } from "@/lib/auth/guards";
import { PostHogIdentify } from "@/shared/components/posthog-identify";
import { maybeRenewFreeCredits } from "@/lib/credits";
import { PLANS } from "@/lib/plans";

export default async function AppWithSidebarLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getSession();

	// Lazy renewal for free plan credits
	const plan = (session?.user?.plan || "free") as "free" | "basic" | "pro";
	let credits = session?.user?.credits ?? 0;

	if (session?.user?.id) {
		const renewed = await maybeRenewFreeCredits(
			session.user.id,
			plan,
			session.user.creditsResetAt ?? null,
		);
		if (renewed) {
			credits = PLANS.free.credits;
		}
	}

	const user = {
		name: session?.user?.name || "Name",
		email: session?.user?.email || "email@example.com",
		avatar: session?.user?.image || undefined,
		role: session?.user?.role || "user",
		plan,
		credits,
		paymentFailed: session?.user?.paymentFailed ?? false,
	};

	return (
		<SidebarProvider>
			<PostHogIdentify
				userId={session?.user?.id || ""}
				email={user.email}
				name={user.name}
				role={user.role}
				plan={user.plan}
			/>
			<AppSidebar user={user} />
			<SidebarInset>
				<div className="p-3">
					<NavTrigger />
					<div className="px-6">{children}</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
