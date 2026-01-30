"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CircleDashed } from "lucide-react";

interface MenuItem {
	name: string;
	href: string;
}

interface NavProps {
	menuItems?: MenuItem[];
}

export const Nav = ({ menuItems = [] }: NavProps) => {
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const hasMenuItems = menuItems.length > 0;

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 50);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// Close mobile menu on anchor click
	const handleLinkClick = () => setOpen(false);

	return (
		<header className="fixed top-0 z-50 w-full">
			<div className="mx-auto px-4 pt-3 sm:px-6">
				<nav
					className={cn(
						"mx-auto flex max-w-5xl items-center justify-between rounded-2xl px-5 py-3.5 transition-all duration-500 ease-out sm:px-8",
						scrolled
							? "border bg-background/80 shadow-sm backdrop-blur-xl"
							: "bg-transparent",
					)}
				>
					{/* Logo */}
					<Link
						href="/"
						aria-label="Salia — Home"
						className="flex items-center gap-2 transition-opacity hover:opacity-70"
					>
						<CircleDashed size={22} strokeWidth={3.5} />
						<span className="text-2xl font-semibold tracking-tight">
							Salia
						</span>
					</Link>

					{/* Center links — desktop */}
					{hasMenuItems && (
						<ul className="hidden items-center gap-1.5 lg:flex">
							{menuItems.map((item) => (
								<li key={item.name}>
									<Link
										href={item.href}
										className="rounded-lg px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					)}

					{/* Right CTAs — desktop */}
					<div className="hidden items-center gap-3 lg:flex">
						<Button asChild variant="ghost" size="sm">
							<Link href="/auth">Login</Link>
						</Button>
						<Button asChild size="sm">
							<Link href="/auth">Try for free</Link>
						</Button>
					</div>

					{/* Hamburger — mobile */}
					<button
						onClick={() => setOpen(!open)}
						aria-label={open ? "Close menu" : "Open menu"}
						className="relative z-50 flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-accent lg:hidden"
					>
						<span className="relative size-5">
							<Menu
								className={cn(
									"absolute inset-0 m-auto size-5 transition-all duration-200",
									open && "rotate-90 scale-0 opacity-0",
								)}
							/>
							<X
								className={cn(
									"absolute inset-0 m-auto size-5 transition-all duration-200",
									!open && "-rotate-90 scale-0 opacity-0",
								)}
							/>
						</span>
					</button>
				</nav>

				{/* Mobile menu panel */}
				<div
					className={cn(
						"mx-auto mt-2 max-w-5xl overflow-hidden rounded-2xl border bg-background transition-all duration-300 ease-out lg:hidden",
						open
							? "max-h-[400px] opacity-100 shadow-lg"
							: "max-h-0 border-transparent opacity-0",
					)}
				>
					<div className="space-y-6 p-6">
						{hasMenuItems && (
							<ul className="space-y-1">
								{menuItems.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											onClick={handleLinkClick}
											className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						)}

						<div className="flex flex-col gap-2">
							<Button asChild variant="outline" className="w-full">
								<Link href="/auth" onClick={handleLinkClick}>
									Login
								</Link>
							</Button>
							<Button asChild className="w-full">
								<Link href="/auth" onClick={handleLinkClick}>
									Try for free
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};
