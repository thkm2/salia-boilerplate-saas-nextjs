"use client"

import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { Separator } from "@/shared/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/shared/components/ui/breadcrumb"
import { Fragment } from "react"
import {
	CircleDashed,
	LayoutDashboard,
	BrickWallShield,
	Users,
	List,
	CircleHelp,
	Settings,
	CreditCard,
	Binary,
	type LucideIcon,
} from "lucide-react"

const iconRegistry: Record<string, LucideIcon> = {
	"layout-dashboard": LayoutDashboard,
	"brick-wall-shield": BrickWallShield,
	users: Users,
	list: List,
	"circle-help": CircleHelp,
	settings: Settings,
	"credit-card": CreditCard,
	binary: Binary,
}

const segmentIcons: Record<string, LucideIcon> = {
	dashboard: LayoutDashboard,
	users: Users,
	page: List,
	help: CircleHelp,
	settings: Settings,
	plans: CreditCard,
}

type NavTriggerProps = {
	hiddenSegments?: string[]
	iconOverrides?: Record<string, string>
}

export default function NavTrigger({ hiddenSegments, iconOverrides }: NavTriggerProps) {
	const pathname = usePathname()

	const segments = pathname.split("/").filter(Boolean)
	const visibleSegments = hiddenSegments
		? segments.filter((s) => !hiddenSegments.includes(s))
		: segments

	const breadcrumbs = visibleSegments.map((segment, index) => {
		// Build path from original segments up to this visible segment's position
		const originalIndex = segments.indexOf(segment)
		const path = "/" + segments.slice(0, originalIndex + 1).join("/")
		const isLast = index === visibleSegments.length - 1
		const overrideKey = iconOverrides?.[segment]
		const Icon: LucideIcon = (overrideKey ? iconRegistry[overrideKey] : undefined) ?? segmentIcons[segment] ?? Binary

		return { Icon, path, isLast }
	})

	return (
		<div className="flex justify-start items-center gap-2 border-b border-transparent hover:border-border pb-2.5 mb-6 transition-colors duration-500">
			<SidebarTrigger />
			<Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbPage>
							<CircleDashed className="size-4" strokeWidth={2.25} />
						</BreadcrumbPage>
					</BreadcrumbItem>
					{breadcrumbs.map((breadcrumb, index) => (
						<Fragment key={index}>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								{breadcrumb.isLast ? (
									<BreadcrumbPage>
										<breadcrumb.Icon className="size-4" />
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink href={breadcrumb.path}>
										<breadcrumb.Icon className="size-4" />
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	)
}
