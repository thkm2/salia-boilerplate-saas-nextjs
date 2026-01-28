"use client"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { Separator } from "@/shared/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/shared/components/ui/breadcrumb"
import { useEffect, useState } from "react"
import { Fragment } from "react"

export default function NavTrigger() {
	const pathname = usePathname();
	const [isClient, setIsClient] = useState(false);
	
	// S'assurer que le composant est hydraté côté client
	useEffect(() => {
		setIsClient(true);
	}, []);
	
	// Table de labels pour segments connus (fallback: Capitalize)
	const labels: Record<string, string> = {
		dashboard: "Dashboard",
		form: "Form",
	};
	
	// Générer les breadcrumbs dynamiquement depuis le pathname
	const generateBreadcrumbs = (path: string) => {
		const segments = path.split('/').filter(Boolean);
		const breadcrumbs: { label: string; path: string; isLast: boolean; isClickable: boolean }[] = [];

		let acc = '';
		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i];
			acc += `/${segment}`;
			const isLast = i === segments.length - 1;

			const label = labels[segment] ?? (segment.charAt(0).toUpperCase() + segment.slice(1));

			breadcrumbs.push({
				label,
				path: acc,
				isLast,
				isClickable: !isLast,
			});
		}

		return breadcrumbs;
	};
	
	// Afficher un breadcrumb par défaut pendant l'hydratation
	if (!isClient) {
		return (
			<div className="flex justify-start items-center gap-2 border-b border-transparent hover:border-border pb-2.5 mb-6 transition-colors duration-500">
				<SidebarTrigger />
				<Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4"/>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbPage>Loading...</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		);
	}
	
	const breadcrumbs = generateBreadcrumbs(pathname);
	
	return (
		<div className="flex justify-start items-center gap-2 border-b border-transparent hover:border-border pb-2.5 mb-6 transition-colors duration-500">
			<SidebarTrigger />
			<Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4"/>
			<Breadcrumb>
				<BreadcrumbList>
					{breadcrumbs.map((breadcrumb, index) => (
						<Fragment key={`breadcrumb-${index}`}>
							{index > 0 && <BreadcrumbSeparator />}
							<BreadcrumbItem>
								{breadcrumb.isClickable ? (
									<BreadcrumbLink href={breadcrumb.path}>
										{breadcrumb.label}
									</BreadcrumbLink>
								) : (
									<BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
								)}
							</BreadcrumbItem>
						</Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	)
}