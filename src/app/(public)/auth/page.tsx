"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/shared/components/ui/form";
import { signIn } from "@/lib/auth/client";
import { toast } from "sonner";
import { CircleDashed, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

const signupSchema = z.object({
	name: z.string().min(1, "Please enter your name"),
	email: z.email("Please enter a valid email address"),
});

const signinSchema = z.object({
	email: z.email("Please enter a valid email address"),
});

const AUTH_STORAGE_KEY = "salia_has_account";

export default function AuthPage() {
	const [mode, setMode] = useState<"signup" | "signin">("signup");
	const [ready, setReady] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (localStorage.getItem(AUTH_STORAGE_KEY)) {
			setMode("signin");
		}
		setReady(true);
	}, []);
	const [magicLinkState, setMagicLinkState] = useState<
		"idle" | "form" | "loading" | "sent"
	>("idle");

	const form = useForm<z.infer<typeof signupSchema>>({
		resolver: (...args) =>
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(zodResolver(mode === "signup" ? signupSchema : signinSchema) as any)(
				...args,
			),
		defaultValues: { name: "", email: "" },
	});

	const handleGoogleAuth = async () => {
		setIsLoading(true);
		const { error } = await signIn.social({
			provider: "google",
			callbackURL: "/dashboard",
		});
		if (error) {
			toast.error("Failed to sign in with Google");
			console.error(error);
			setIsLoading(false);
		} else {
			localStorage.setItem(AUTH_STORAGE_KEY, "1");
		}
	};

	const handleToggleMode = () => {
		setMode((m) => (m === "signup" ? "signin" : "signup"));
		setMagicLinkState("idle");
		form.reset();
	};

	const handleMagicLink = async (values: z.infer<typeof signupSchema>) => {
		setMagicLinkState("loading");
		const { error } = await signIn.magicLink({
			email: values.email,
			...(mode === "signup" && values.name ? { name: values.name } : {}),
			callbackURL: "/dashboard",
		});
		if (error) {
			toast.error("Failed to send magic link");
			console.error(error);
			setMagicLinkState("form");
		} else {
			localStorage.setItem(AUTH_STORAGE_KEY, "1");
			setMagicLinkState("sent");
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
					<div className={`w-full max-w-sm space-y-8 transition-opacity duration-500 ${ready ? "animate-in fade-in slide-in-from-bottom-3" : "opacity-0"}`}>
						{/* Heading */}
						<div className="space-y-2">
							<h1 className="text-2xl font-bold tracking-tight">
								{mode === "signup" ? "Create an account" : "Welcome back"}
							</h1>
							<p className="text-sm text-muted-foreground">
								{mode === "signup"
									? "Get started for free"
									: "Sign in to your account"}
							</p>
						</div>

						{/* Separator */}
						<div className="h-px w-8 bg-border" />

						{magicLinkState === "sent" ? (
							<div className="space-y-4">
								<div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
									<Mail className="size-5 shrink-0 text-muted-foreground" />
									<div className="space-y-1">
										<p className="text-sm font-medium">Check your inbox</p>
										<p className="text-xs text-muted-foreground">
											We sent a sign-in link to{" "}
											<span className="font-medium text-foreground">{form.getValues("email")}</span>
										</p>
									</div>
								</div>
								<Button
									type="button"
									variant="ghost"
									className="h-9 text-sm text-muted-foreground"
									onClick={() => {
										setMagicLinkState("idle");
										form.reset();
									}}
								>
									<ArrowLeft className="size-3.5" />
									Back to sign in
								</Button>
							</div>
						) : (
							<>
								{/* Buttons */}
								<div className="space-y-3">
									<Button
										type="button"
										variant="outline"
										className="w-full h-11 rounded-lg text-sm font-medium"
										onClick={handleGoogleAuth}
										disabled={isLoading || magicLinkState === "loading"}
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
								</div>

								{/* Divider */}
								<div className="relative">
									<div className="absolute inset-0 flex items-center">
										<div className="w-full border-t border-border" />
									</div>
									<div className="relative flex justify-center text-xs">
										<span className="bg-background px-2 text-muted-foreground">
											or
										</span>
									</div>
								</div>

								{/* Magic Link form */}
								{magicLinkState === "idle" ? (
									<Button
										type="button"
										variant="outline"
										className="w-full h-11 rounded-lg text-sm font-medium"
										onClick={() => setMagicLinkState("form")}
										disabled={isLoading}
									>
										<Mail className="size-4" />
										Continue with Email
									</Button>
								) : (
									<Form {...form}>
										<form onSubmit={form.handleSubmit(handleMagicLink)} className="space-y-3">
											{mode === "signup" && (
												<FormField
													control={form.control}
													name="name"
													render={({ field }) => (
														<FormItem>
															<FormControl>
																<Input
																	type="text"
																	placeholder="Your name"
																	autoFocus
																	className="h-11 rounded-lg"
																	disabled={magicLinkState === "loading"}
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											)}
											<FormField
												control={form.control}
												name="email"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Input
																type="email"
																placeholder="you@example.com"
																autoFocus={mode === "signin"}
																className="h-11 rounded-lg"
																disabled={magicLinkState === "loading"}
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<Button
												type="submit"
												className="w-full h-11 rounded-lg text-sm font-medium"
												disabled={magicLinkState === "loading"}
											>
												{magicLinkState === "loading" ? (
													"Sending..."
												) : (
													"Send magic link"
												)}
											</Button>
											<Button
												type="button"
												variant="ghost"
												className="w-full h-9 text-sm text-muted-foreground"
												onClick={() => {
													setMagicLinkState("idle");
													form.reset();
												}}
												disabled={magicLinkState === "loading"}
											>
												Cancel
											</Button>
										</form>
									</Form>
								)}

								{/* Toggle mode link */}
								<p className="text-center text-sm text-muted-foreground">
									{mode === "signup" ? (
										<>
											Already have an account?{" "}
											<button
												type="button"
												onClick={handleToggleMode}
												className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-foreground/80"
											>
												Sign in
											</button>
										</>
									) : (
										<>
											Don&apos;t have an account?{" "}
											<button
												type="button"
												onClick={handleToggleMode}
												className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-foreground/80"
											>
												Sign up
											</button>
										</>
									)}
								</p>
							</>
						)}

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
