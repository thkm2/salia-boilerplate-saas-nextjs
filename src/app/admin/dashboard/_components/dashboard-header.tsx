import { LayoutDashboard, Users, Activity, TrendingUp, Coins } from "lucide-react";

interface DashboardHeaderProps {
	stats: {
		totalUsers: number;
		activeUsers: number;
		growthRate: number;
		totalCreditsUsed: number;
	};
}

export function DashboardHeader({ stats }: DashboardHeaderProps) {
	return (
		<div className="space-y-6">
			{/* Title Section */}
			<div className="flex items-start justify-between">
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 ring-1 ring-foreground/10">
							<LayoutDashboard className="h-5 w-5 text-foreground/70" />
						</div>
						<div>
							<h1 className="text-2xl font-semibold tracking-tight">
								Dashboard
							</h1>
							<p className="text-sm text-muted-foreground">
								Overview of your platform metrics
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					label="Total Users"
					value={stats.totalUsers}
					icon={Users}
					accent="default"
				/>
				<StatCard
					label="Active Users"
					value={stats.activeUsers}
					suffix="/ 30d"
					icon={Activity}
					accent="success"
				/>
				<StatCard
					label="Growth Rate"
					value={stats.growthRate}
					suffix="%"
					icon={TrendingUp}
					accent="info"
				/>
				<StatCard
					label="Credits Used"
					value={stats.totalCreditsUsed}
					icon={Coins}
					accent="warning"
				/>
			</div>
		</div>
	);
}

function StatCard({
	label,
	value,
	suffix,
	icon: Icon,
	accent,
}: {
	label: string;
	value: number;
	suffix?: string;
	icon: React.ComponentType<{ className?: string }>;
	accent: "default" | "success" | "info" | "warning";
}) {
	const accentStyles = {
		default: "bg-foreground/5 text-foreground/70 ring-foreground/10",
		success:
			"bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400",
		info: "bg-blue-500/10 text-blue-600 ring-blue-500/20 dark:text-blue-400",
		warning:
			"bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400",
	};

	return (
		<div className="group relative overflow-hidden rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-foreground/20">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
						{label}
					</p>
					<p className="text-2xl font-semibold tabular-nums">
						{value.toLocaleString("en-US")}
						{suffix && (
							<span className="ml-1 text-sm font-normal text-muted-foreground">
								{suffix}
							</span>
						)}
					</p>
				</div>
				<div
					className={`flex h-10 w-10 items-center justify-center rounded-lg ring-1 ${accentStyles[accent]}`}
				>
					<Icon className="h-5 w-5" />
				</div>
			</div>
			{/* Subtle gradient overlay on hover */}
			<div className="absolute inset-0 -z-10 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
		</div>
	);
}
