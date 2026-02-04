"use client";

import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { TrendingUp } from "lucide-react";

const chartConfig = {
	users: {
		label: "New Users",
	},
} satisfies ChartConfig;

interface UserGrowthChartProps {
	data: { label: string; users: number }[];
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
	const total = data.reduce((sum, item) => sum + item.users, 0);
	const lastWeek = data[data.length - 1]?.users ?? 0;
	const prevWeek = data[data.length - 2]?.users ?? 0;
	const trend = prevWeek > 0 ? Math.round(((lastWeek - prevWeek) / prevWeek) * 100) : 0;

	return (
		<div className="group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md hover:border-foreground/20">
			{/* Header */}
			<div className="flex items-center justify-between p-4 pb-0">
				<div className="space-y-1">
					<h3 className="font-semibold tracking-tight">User Growth</h3>
					<p className="text-sm text-muted-foreground">
						New registrations over the last 4 weeks
					</p>
				</div>
				<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 ring-1 ring-foreground/10">
					<TrendingUp className="h-4 w-4 text-foreground/70" />
				</div>
			</div>

			{/* Chart */}
			<div className="p-4 pt-2">
				<ChartContainer config={chartConfig} className="h-[220px] w-full">
					<AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
						<defs>
							<linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--foreground)"
									stopOpacity={0.15}
								/>
								<stop
									offset="95%"
									stopColor="var(--foreground)"
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							className="stroke-border/50"
							vertical={false}
						/>
						<XAxis
							dataKey="label"
							className="text-xs"
							tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							className="text-xs"
							tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
							tickLine={false}
							axisLine={false}
						/>
						<ChartTooltip
							content={<ChartTooltipContent />}
							cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "4 4" }}
						/>
						<Area
							type="monotone"
							dataKey="users"
							stroke="var(--foreground)"
							strokeWidth={2}
							fill="url(#fillUsers)"
							dot={false}
							activeDot={{
								r: 5,
								fill: "var(--background)",
								stroke: "var(--foreground)",
								strokeWidth: 2,
							}}
						/>
					</AreaChart>
				</ChartContainer>

				{/* Summary */}
				<div className="mt-3 flex items-center justify-between border-t pt-3">
					<div className="flex items-center gap-1.5 text-xs">
						<span className="text-muted-foreground">Total new users:</span>
						<span className="font-semibold tabular-nums">{total}</span>
					</div>
					{trend !== 0 && (
						<div
							className={`flex items-center gap-1 text-xs ${trend > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
						>
							<TrendingUp
								className={`h-3 w-3 ${trend < 0 ? "rotate-180" : ""}`}
							/>
							<span className="font-medium tabular-nums">
								{trend > 0 ? "+" : ""}
								{trend}% vs last week
							</span>
						</div>
					)}
				</div>
			</div>

			{/* Hover overlay */}
			<div className="absolute inset-0 -z-10 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
		</div>
	);
}
