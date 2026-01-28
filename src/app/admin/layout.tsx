import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "./_side-bar/side-bar";
import { SidebarInset } from "@/shared/components/ui/sidebar";
import NavTrigger from "./_side-bar/nav-trigger";
import { getSession } from "@/lib/auth/guards";
import { redirect } from "next/navigation";

export default async function AppWithSidebarLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getSession();

	if (!session) {
		redirect("/auth");
	}

	if (session.user.role !== "admin") {
		redirect("/dashboard");
	}

	const user = {
		name: session?.user?.name || "Name",
		email: session?.user?.email || "email@example.com",
		avatar: session?.user?.image || undefined,
	};

	return (
		<SidebarProvider>
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
