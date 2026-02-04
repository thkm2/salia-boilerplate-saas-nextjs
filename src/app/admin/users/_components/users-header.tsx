import { Users, UserCheck, UserPlus } from "lucide-react";

interface UsersHeaderProps {
	total: number;
	stats?: {
		activeToday?: number;
		newThisWeek?: number;
	};
}

export function UsersHeader({ total, stats }: UsersHeaderProps) {
	return (
		<div className="space-y-6">
			{/* Title Section */}
			<div className="flex items-start justify-between">
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 ring-1 ring-foreground/10">
							<Users className="h-5 w-5 text-foreground/70" />
						</div>
						<div>
							<h1 className="text-2xl font-semibold tracking-tight">Users</h1>
							<p className="text-sm text-muted-foreground">
								Manage your user base
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<StatCard
					label="Total Users"
					value={total}
					icon={Users}
					accent="default"
				/>
				<StatCard
					label="Active Today"
					value={stats?.activeToday ?? 0}
					icon={UserCheck}
					accent="success"
				/>
				<StatCard
					label="New This Week"
					value={stats?.newThisWeek ?? 0}
					icon={UserPlus}
					accent="info"
				/>
			</div>
		</div>
	);
}

function StatCard({
	label,
	value,
	icon: Icon,
	accent,
}: {
	label: string;
	value: number;
	icon: React.ComponentType<{ className?: string }>;
	accent: "default" | "success" | "info";
}) {
	const accentStyles = {
		default: "bg-foreground/5 text-foreground/70 ring-foreground/10",
		success: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400",
		info: "bg-blue-500/10 text-blue-600 ring-blue-500/20 dark:text-blue-400",
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
					</p>
				</div>
				<div className={`flex h-10 w-10 items-center justify-center rounded-lg ring-1 ${accentStyles[accent]}`}>
					<Icon className="h-5 w-5" />
				</div>
			</div>
			{/* Subtle gradient overlay on hover */}
			<div className="absolute inset-0 -z-10 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
		</div>
	);
}
