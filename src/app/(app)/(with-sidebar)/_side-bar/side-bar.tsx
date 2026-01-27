"use client";
import * as React from "react";
import { List, HomeIcon, CircleDashed, BadgeQuestionMark } from "lucide-react";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "@/components/ui/sidebar";
import {
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";

type User = {
	name: string;
	email: string;
	avatar?: string;
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
	user: User;
};

const data = {
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: HomeIcon,
		},
		{
			title: "Page",
			url: "/page",
			icon: List,
		},
	],
	navSecondary: [
		{
			title: "Need help",
			url: "/help",
			icon: BadgeQuestionMark,
		},
	],
};
export function AppSidebar({ user, ...sidebarProps }: AppSidebarProps) {
	return (
		<Sidebar collapsible="offcanvas" {...sidebarProps} variant="sidebar">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/">
								<div className="bg-foreground text-background flex aspect-square size-8 items-center justify-center rounded-lg">
									<CircleDashed strokeWidth={2.5} className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">Salia</span>
									<span className="truncate text-xs">$100M Boilerplate</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
