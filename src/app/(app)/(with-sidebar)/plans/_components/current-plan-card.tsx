"use client";

import { AlertTriangle, Zap, CalendarClock, ExternalLink } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { PLANS, type PlanId } from "@/lib/plans";
import { createBillingPortalSession } from "@/shared/actions/stripe";
import { useTransition } from "react";

export function CurrentPlanCard({
	plan,
	credits,
	hasSubscription,
	paymentFailed,
	creditsResetAt,
}: {
	plan: string;
	credits: number;
	hasSubscription: boolean;
	paymentFailed?: boolean;
	creditsResetAt?: Date | null;
}) {
	const [isPending, startTransition] = useTransition();
	const planId = plan as PlanId;
	const planConfig = PLANS[planId] ?? PLANS.free;
	const maxCredits = planConfig.credits;
	const percentage = Math.min(Math.round((credits / maxCredits) * 100), 100);
	const used = maxCredits - credits;

	const nextRenewalDate = creditsResetAt
		? new Date(
				new Date(creditsResetAt).setMonth(
					new Date(creditsResetAt).getMonth() + 1
				)
			)
		: null;

	// Determine status color based on credits remaining
	const statusColor =
		percentage > 50
			? "emerald"
			: percentage > 20
				? "amber"
				: "red";

	const bgGlowMap = {
		emerald: "bg-emerald-500/20",
		amber: "bg-amber-500/20",
		red: "bg-red-500/20",
	};

	return (
		<div className="relative overflow-hidden rounded-2xl border bg-card">
			{/* Decorative background gradient */}
			<div className="absolute top-0 right-0 w-64 h-64 -translate-y-32 translate-x-32">
				<div className={`w-full h-full rounded-full ${bgGlowMap[statusColor]} blur-3xl opacity-50`} />
			</div>

			{/* Payment failed alert */}
			{paymentFailed && (
				<div className="relative z-10 flex items-center gap-2 bg-destructive/10 px-5 py-3 text-sm text-destructive border-b border-destructive/20">
					<AlertTriangle className="size-4 shrink-0" />
					<span>
						Payment failed. Update your billing to continue receiving credits.
					</span>
				</div>
			)}

			<div className="relative z-10 p-6">
				<div className="flex flex-col lg:flex-row lg:items-center gap-6">
					{/* Left: Credit Gauge */}
					<div className="flex items-center gap-5">
						{/* Circular progress indicator */}
						<div className="relative">
							<svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
								{/* Background circle */}
								<circle
									cx="50"
									cy="50"
									r="42"
									fill="none"
									stroke="currentColor"
									strokeWidth="8"
									className="text-muted"
								/>
								{/* Progress circle */}
								<circle
									cx="50"
									cy="50"
									r="42"
									fill="none"
									stroke="url(#creditGradient)"
									strokeWidth="8"
									strokeLinecap="round"
									strokeDasharray={`${percentage * 2.64} 264`}
									className="transition-all duration-500 ease-out"
								/>
								<defs>
									<linearGradient id="creditGradient" x1="0%" y1="0%" x2="100%" y2="0%">
										<stop offset="0%" className={`${statusColor === "emerald" ? "stop-color: #10b981" : statusColor === "amber" ? "stop-color: #f59e0b" : "stop-color: #ef4444"}`} style={{ stopColor: statusColor === "emerald" ? "#10b981" : statusColor === "amber" ? "#f59e0b" : "#ef4444" }} />
										<stop offset="100%" className={`${statusColor === "emerald" ? "stop-color: #14b8a6" : statusColor === "amber" ? "stop-color: #f97316" : "stop-color: #f43f5e"}`} style={{ stopColor: statusColor === "emerald" ? "#14b8a6" : statusColor === "amber" ? "#f97316" : "#f43f5e" }} />
									</linearGradient>
								</defs>
							</svg>
							{/* Center content */}
							<div className="absolute inset-0 flex flex-col items-center justify-center">
								<span className="text-2xl font-bold tabular-nums">{percentage}%</span>
								<span className="text-[10px] uppercase tracking-wider text-muted-foreground">left</span>
							</div>
						</div>

						{/* Credit numbers */}
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<Zap className={`h-4 w-4 ${statusColor === "emerald" ? "text-emerald-500" : statusColor === "amber" ? "text-amber-500" : "text-red-500"}`} />
								<span className="text-sm font-medium text-muted-foreground">Credits</span>
							</div>
							<div className="flex items-baseline gap-1">
								<span className="text-3xl font-bold tabular-nums">{credits.toLocaleString("en-US")}</span>
								<span className="text-sm text-muted-foreground">/ {maxCredits.toLocaleString("en-US")}</span>
							</div>
							<p className="text-xs text-muted-foreground">
								{used.toLocaleString("en-US")} used this period
							</p>
						</div>
					</div>

					{/* Divider */}
					<div className="hidden lg:block w-px h-20 bg-border" />
					<div className="lg:hidden h-px w-full bg-border" />

					{/* Right: Plan info & actions */}
					<div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<span className="text-sm text-muted-foreground">Current plan</span>
								<Badge
									variant="secondary"
									className={`font-semibold ${
										planId === "pro"
											? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
											: planId === "basic"
												? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
												: ""
									}`}
								>
									{planConfig.label}
								</Badge>
							</div>
							<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
								<CalendarClock className="h-3.5 w-3.5" />
								{paymentFailed ? (
									<span className="text-destructive">Credits paused until payment resolved</span>
								) : nextRenewalDate ? (
									<span>
										Renews {nextRenewalDate.toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric"
										})}
									</span>
								) : (
									<span>Credits renew monthly</span>
								)}
							</div>
						</div>

						{hasSubscription ? (
							<Button
								variant="outline"
								size="sm"
								disabled={isPending}
								onClick={() => startTransition(() => createBillingPortalSession())}
								className="gap-1.5 shrink-0"
							>
								{isPending ? "Redirecting..." : "Manage billing"}
								<ExternalLink className="h-3.5 w-3.5" />
							</Button>
						) : (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button disabled variant="outline" size="sm" className="shrink-0">
											Manage billing
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Available on paid plans</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
