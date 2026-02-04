"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
	{
		href: "/m",
		icon: Home,
		label: "Home",
	},
	{
		href: "/m/search",
		icon: Search,
		label: "Search",
	},
	{
		href: "/m/create",
		icon: Plus,
		label: "Create",
		isFab: true,
	},
	{
		href: "/m/messages",
		icon: MessageCircle,
		label: "Messages",
	},
	{
		href: "/m/profile",
		icon: User,
		label: "Profile",
	},
];

export function MobileNavbar() {
	const pathname = usePathname();

	return (
		<nav
			className={cn(
				"fixed bottom-0 left-0 right-0 z-50",
				"pb-[env(safe-area-inset-bottom)]",
				// Desktop: elegant floating dock
				"md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-auto"
			)}
		>
			{/* Glow effect behind the navbar - Mobile only */}
			<div
				className={cn(
					"absolute inset-0 -z-10",
					"bg-gradient-to-t from-background via-background/80 to-transparent",
					"md:hidden"
				)}
				style={{ height: "150%" }}
			/>

			<div
				className={cn(
					"group/nav relative flex items-center justify-around",
					// Mobile: Glass effect (unchanged)
					"bg-background/70 backdrop-blur-2xl backdrop-saturate-150",
					"border-t border-border",
					"shadow-[0_-1px_0_0_rgba(255,255,255,0.05)_inset]",
					"dark:shadow-[0_-1px_0_0_rgba(255,255,255,0.03)_inset,0_1px_0_0_rgba(0,0,0,0.5)_inset]",
					"px-2 py-1 h-auto",
					// Desktop: Premium floating dock
					"md:bg-background/50 md:backdrop-blur-3xl md:backdrop-saturate-200",
					"md:border md:border-white/[0.08] md:dark:border-white/[0.04]",
					"md:rounded-2xl md:px-1.5 md:py-1.5 md:h-auto",
					// Desktop: Multi-layer shadow for depth
					"md:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_4px_6px_-1px_rgba(0,0,0,0.05),0_20px_50px_-12px_rgba(0,0,0,0.2)]",
					"md:dark:shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_4px_6px_-1px_rgba(0,0,0,0.2),0_20px_50px_-12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.03)]",
					"md:gap-0.5",
					// Desktop: Subtle hover lift
					"md:transition-all md:duration-500 md:ease-out",
					"md:hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_8px_12px_-2px_rgba(0,0,0,0.08),0_28px_60px_-15px_rgba(0,0,0,0.25)]",
					"md:dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_12px_-2px_rgba(0,0,0,0.3),0_28px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.04)]"
				)}
			>
				{/* Desktop: Top highlight line */}
				<div
					className={cn(
						"hidden md:block",
						"absolute inset-x-4 top-0 h-px",
						"bg-gradient-to-r from-transparent via-white/15 to-transparent",
						"dark:via-white/[0.06]"
					)}
				/>

				{navItems.map((item, index) => {
					const isActive = pathname === item.href;
					const Icon = item.icon;

					if (item.isFab) {
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									// Mobile: Original FAB style (unchanged)
									"group relative -mt-6 flex items-center justify-center",
									"w-14 h-14 rounded-2xl",
									"bg-foreground text-background",
									"shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3)]",
									"dark:shadow-[0_4px_24px_-2px_rgba(255,255,255,0.15)]",
									"transition-all duration-300 ease-out",
									"hover:scale-105 hover:shadow-[0_8px_28px_-4px_rgba(0,0,0,0.4)]",
									"dark:hover:shadow-[0_8px_32px_-4px_rgba(255,255,255,0.2)]",
									"active:scale-95 active:duration-100",
									// Desktop: Elevated accent button
									"md:w-10 md:h-10 md:-mt-0 md:mx-0.5",
									"md:rounded-xl",
									"md:bg-foreground md:text-background",
									"md:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_6px_16px_-4px_rgba(0,0,0,0.2)]",
									"md:dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_6px_16px_-4px_rgba(0,0,0,0.4)]",
									"md:hover:scale-110 md:hover:-translate-y-1",
									"md:hover:shadow-[0_2px_6px_rgba(0,0,0,0.15),0_12px_24px_-6px_rgba(0,0,0,0.3)]",
									"md:dark:hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),0_12px_24px_-6px_rgba(0,0,0,0.5)]",
									"md:active:scale-100 md:active:translate-y-0"
								)}
								aria-label={item.label}
								style={{
									animationDelay: `${index * 50}ms`,
								}}
							>
								{/* Mobile: Shimmer effect (unchanged) */}
								<div
									className={cn(
										"absolute inset-0 rounded-2xl overflow-hidden",
										"opacity-0 group-hover:opacity-100",
										"transition-opacity duration-300",
										"md:rounded-xl"
									)}
								>
									<div
										className={cn(
											"absolute inset-0",
											"bg-gradient-to-tr from-transparent via-white/20 to-transparent",
											"translate-x-[-100%] group-hover:translate-x-[100%]",
											"transition-transform duration-700 ease-out"
										)}
									/>
								</div>

								<Icon
									className={cn(
										"w-6 h-6 relative z-10",
										"transition-all duration-300",
										"group-hover:rotate-90",
										// Desktop: Clean icon
										"md:w-[18px] md:h-[18px]",
										"md:group-hover:rotate-0 md:group-hover:scale-105"
									)}
									strokeWidth={2}
								/>

								{/* Pulse ring on active */}
								{isActive && (
									<span
										className={cn(
											"absolute inset-0 rounded-2xl",
											"bg-foreground opacity-20",
											"md:rounded-xl"
										)}
										style={{ animationDuration: "2s" }}
									/>
								)}
							</Link>
						);
					}

					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								// Mobile: Original style (unchanged)
								"group relative flex flex-col items-center justify-center",
								"w-16 h-14 rounded-2xl",
								"transition-all duration-300 ease-out",
								"text-muted-foreground",
								"hover:text-foreground",
								// Desktop: Refined horizontal items
								"md:flex-row md:gap-2 md:px-3.5 md:py-2 md:w-auto md:h-auto",
								"md:rounded-xl",
								"md:transition-all md:duration-200 md:ease-out",
								isActive && "md:bg-foreground/[0.07] md:dark:bg-white/[0.07]",
								!isActive && "md:hover:bg-foreground/[0.04] md:dark:hover:bg-white/[0.04]"
							)}
							aria-label={item.label}
						>
							{/* Mobile: Active indicator (unchanged) */}
							<span
								className={cn(
									"absolute inset-1 rounded-xl",
									"bg-muted/80 dark:bg-muted/50",
									"transition-all duration-300 ease-out",
									"scale-0 opacity-0",
									isActive && "scale-100 opacity-100",
									"group-hover:scale-100 group-hover:opacity-50",
									"md:hidden"
								)}
							/>

							{/* Icon */}
							<span
								className={cn(
									"relative z-10",
									"transition-all duration-300",
									isActive && "-translate-y-0.5",
									// Desktop
									"md:translate-y-0",
									"md:group-hover:-translate-y-px md:transition-transform md:duration-200"
								)}
							>
								<Icon
									className={cn(
										"w-[22px] h-[22px]",
										"transition-all duration-300",
										isActive && "text-foreground",
										// Desktop
										"md:w-[18px] md:h-[18px]",
										!isActive && "md:text-muted-foreground md:group-hover:text-foreground"
									)}
									strokeWidth={isActive ? 2.5 : 1.8}
								/>
							</span>

							{/* Label */}
							<span
								className={cn(
									"relative z-10 text-[11px] font-medium tracking-tight",
									"transition-all duration-300",
									"opacity-0 translate-y-1",
									isActive && "opacity-100 translate-y-0 text-foreground",
									// Desktop: Clean typography
									"md:text-[13px] md:font-medium md:tracking-normal md:leading-none",
									"md:opacity-100 md:translate-y-0",
									isActive && "md:font-semibold md:text-foreground",
									!isActive && "md:text-muted-foreground md:group-hover:text-foreground"
								)}
							>
								{item.label}
							</span>

							{/* Mobile: Active dot (unchanged) */}
							<span
								className={cn(
									"absolute -bottom-0.5 left-1/2 -translate-x-1/2",
									"w-1 h-1 rounded-full bg-foreground",
									"transition-all duration-300",
									"scale-0 opacity-0",
									isActive && "scale-100 opacity-100",
									"md:hidden"
								)}
							/>

							{/* Desktop: Active indicator line */}
							<span
								className={cn(
									"hidden md:block",
									"absolute bottom-0.5 left-1/2 -translate-x-1/2",
									"h-[3px] rounded-full",
									"bg-foreground dark:bg-white",
									"transition-all duration-300 ease-out",
									"w-0 opacity-0",
									isActive && "w-5 opacity-100"
								)}
							/>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
