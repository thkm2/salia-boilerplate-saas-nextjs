"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { signIn } from "@/lib/auth/client";
import { toast } from "sonner";
import { CircleDashed, Mail } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
	const [isLoading, setIsLoading] = useState(false);

	const handleGoogleAuth = async () => {
		setIsLoading(true);
		try {
			await signIn.social({
				provider: "google",
				callbackURL: "/dashboard",
			});
		} catch (error) {
			toast.error("Failed to sign in with Google");
			console.error(error);
			setIsLoading(false);
		}
	};

	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			{/* ── Left: Brand panel ── */}
			<div className="relative hidden overflow-hidden bg-foreground lg:flex lg:items-end">
				{/* Dot grid texture */}
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage:
							"radial-gradient(circle, currentColor 1px, transparent 1px)",
						backgroundSize: "24px 24px",
						color: "white",
					}}
				/>

				{/* Subtle gradient wash */}
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-white/[0.02]" />

				{/* Content */}
				<div className="relative z-10 flex h-full w-full flex-col justify-between p-12">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center gap-2.5 text-background transition-opacity hover:opacity-70"
					>
						<CircleDashed size={22} strokeWidth={3.5} />
						<span className="text-2xl font-semibold tracking-tight">
							Salia
						</span>
					</Link>

					{/* Tagline area */}
					<div className="max-w-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
						<blockquote className="space-y-4">
							<p className="text-lg leading-relaxed font-medium text-background/90">
								&ldquo;Ship your SaaS in days, not months. Everything you need,
								nothing you don&rsquo;t.&rdquo;
							</p>
							<footer className="text-sm text-background/40">
								Built for makers who value speed and craft.
							</footer>
						</blockquote>
					</div>
				</div>
			</div>

			{/* ── Right: Auth form ── */}
			<div className="flex flex-col">
				{/* Mobile logo bar */}
				<div className="flex items-center justify-between p-6 lg:hidden">
					<Link
						href="/"
						className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-70"
					>
						<CircleDashed size={20} strokeWidth={3.5} />
						<span className="text-xl font-semibold tracking-tight">
							Salia
						</span>
					</Link>
				</div>

				{/* Desktop top-right link */}
				<div className="hidden items-center justify-end p-8 lg:flex">
					<Link
						href="/"
						className="text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						Back to home
					</Link>
				</div>

				{/* Form */}
				<div className="flex flex-1 items-center justify-center px-6 pb-16 lg:px-16">
					<div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
						{/* Heading */}
						<div className="space-y-2">
							<h1 className="text-2xl font-bold tracking-tight">
								Welcome
							</h1>
							<p className="text-sm text-muted-foreground">
								Sign in to your account or create a new one
							</p>
						</div>

						{/* Separator */}
						<div className="h-px w-8 bg-border" />

						{/* Buttons */}
						<div className="space-y-3">
							<Button
								type="button"
								variant="outline"
								className="w-full h-11 rounded-lg text-sm font-medium"
								onClick={handleGoogleAuth}
								disabled={isLoading}
							>
								<svg className="size-4" viewBox="0 0 24 24">
									<path
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										fill="#4285F4"
									/>
									<path
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										fill="#34A853"
									/>
									<path
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										fill="#FBBC05"
									/>
									<path
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										fill="#EA4335"
									/>
								</svg>
								Continue with Google
							</Button>

							<Button
								type="button"
								variant="outline"
								className="w-full h-11 rounded-lg text-sm font-medium"
								disabled={true}
							>
								<Mail className="size-4" />
								Magic Link
								<span className="ml-auto text-[10px] font-normal tracking-wide uppercase text-muted-foreground/60">
									Soon
								</span>
							</Button>
						</div>

						{/* Terms */}
						<p className="text-[11px] leading-relaxed text-muted-foreground/60">
							By continuing, you agree to our{" "}
							<Link
								href="/terms"
								className="underline underline-offset-2 transition-colors hover:text-foreground"
							>
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link
								href="/privacy"
								className="underline underline-offset-2 transition-colors hover:text-foreground"
							>
								Privacy Policy
							</Link>
							.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
