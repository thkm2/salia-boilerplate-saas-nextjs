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
				// Desktop: floating pill
				"md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-auto"
			)}
		>
			{/* Glow effect behind the navbar */}
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
					"relative flex items-center justify-around",
					// Glass effect
					"bg-background/70 backdrop-blur-2xl backdrop-saturate-150",
					"border-t border-white/10 dark:border-white/5",
					// Inner glow
					"shadow-[0_-1px_0_0_rgba(255,255,255,0.05)_inset]",
					"dark:shadow-[0_-1px_0_0_rgba(255,255,255,0.03)_inset,0_1px_0_0_rgba(0,0,0,0.5)_inset]",
					"px-2 h-[72px]",
					// Desktop: pill shape with shadow
					"md:border md:border-border/50 md:rounded-2xl md:px-3 md:h-16",
					"md:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.05)_inset]",
					"md:dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)_inset]",
					"md:gap-1"
				)}
			>
				{navItems.map((item, index) => {
					const isActive = pathname === item.href;
					const Icon = item.icon;

					if (item.isFab) {
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"group relative -mt-6 flex items-center justify-center",
									"w-14 h-14 rounded-2xl",
									"bg-foreground text-background",
									// Glow effect
									"shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3)]",
									"dark:shadow-[0_4px_24px_-2px_rgba(255,255,255,0.15)]",
									// Transitions
									"transition-all duration-300 ease-out",
									"hover:scale-105 hover:shadow-[0_8px_28px_-4px_rgba(0,0,0,0.4)]",
									"dark:hover:shadow-[0_8px_32px_-4px_rgba(255,255,255,0.2)]",
									"active:scale-95 active:duration-100",
									// Desktop
									"md:w-12 md:h-12 md:-mt-4 md:rounded-xl"
								)}
								aria-label={item.label}
								style={{
									animationDelay: `${index * 50}ms`,
								}}
							>
								{/* Shimmer effect on hover */}
								<div
									className={cn(
										"absolute inset-0 rounded-2xl md:rounded-xl overflow-hidden",
										"opacity-0 group-hover:opacity-100",
										"transition-opacity duration-300"
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
										"w-6 h-6 md:w-5 md:h-5 relative z-10",
										"transition-transform duration-300",
										"group-hover:rotate-90"
									)}
									strokeWidth={2}
								/>

								{/* Pulse ring on active */}
								{isActive && (
									<span
										className={cn(
											"absolute inset-0 rounded-2xl md:rounded-xl",
											"animate-ping opacity-20 bg-foreground"
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
								"group relative flex flex-col items-center justify-center",
								"w-16 h-14 rounded-2xl",
								"transition-all duration-300 ease-out",
								"text-muted-foreground",
								"hover:text-foreground",
								"active:scale-90 active:duration-100",
								// Desktop: horizontal
								"md:flex-row md:gap-2 md:px-4 md:w-auto md:h-11 md:rounded-xl"
							)}
							aria-label={item.label}
						>
							{/* Active indicator - morphing background */}
							<span
								className={cn(
									"absolute inset-1 rounded-xl",
									"bg-muted/80 dark:bg-muted/50",
									"transition-all duration-300 ease-out",
									"scale-0 opacity-0",
									isActive && "scale-100 opacity-100",
									"group-hover:scale-100 group-hover:opacity-50",
									"md:inset-0 md:rounded-xl"
								)}
							/>

							{/* Icon with bounce */}
							<span
								className={cn(
									"relative z-10",
									"transition-all duration-300",
									isActive && "-translate-y-0.5 md:translate-y-0"
								)}
							>
								<Icon
									className={cn(
										"w-[22px] h-[22px] md:w-5 md:h-5",
										"transition-all duration-300",
										isActive && "text-foreground"
									)}
									strokeWidth={isActive ? 2.5 : 1.8}
								/>
							</span>

							{/* Label with fade */}
							<span
								className={cn(
									"relative z-10 text-[11px] font-medium tracking-tight",
									"transition-all duration-300",
									"opacity-0 translate-y-1",
									isActive && "opacity-100 translate-y-0 text-foreground",
									// Desktop: always visible
									"md:text-sm md:opacity-100 md:translate-y-0",
									isActive && "md:font-semibold"
								)}
							>
								{item.label}
							</span>

							{/* Active dot indicator (mobile only) */}
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
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
