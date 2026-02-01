import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "./_side-bar/side-bar";
import { SidebarInset } from "@/shared/components/ui/sidebar";
import NavTrigger from "@/shared/components/sidebar/nav-trigger";
import { getSession } from "@/lib/auth/guards";
import { PostHogIdentify } from "@/shared/components/posthog-identify";

export default async function AppWithSidebarLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getSession();
	const user = {
		name: session?.user?.name || "Name",
		email: session?.user?.email || "email@example.com",
		avatar: session?.user?.image || undefined,
		role: session?.user?.role || "user",
		plan: session?.user?.plan || "free",
		credits: session?.user?.credits ?? 0,
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
