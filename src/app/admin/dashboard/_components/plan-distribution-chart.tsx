"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { PieChart } from "lucide-react";

const chartConfig = {
	users: {
		label: "Users",
	},
} satisfies ChartConfig;

interface PlanDistributionChartProps {
	data: { plan: string; users: number }[];
}

export function PlanDistributionChart({ data }: PlanDistributionChartProps) {
	const total = data.reduce((sum, item) => sum + item.users, 0);

	return (
		<div className="group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md hover:border-foreground/20">
			{/* Header */}
			<div className="flex items-center justify-between p-4 pb-0">
				<div className="space-y-1">
					<h3 className="font-semibold tracking-tight">Plan Distribution</h3>
					<p className="text-sm text-muted-foreground">Users by plan type</p>
				</div>
				<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 ring-1 ring-foreground/10">
					<PieChart className="h-4 w-4 text-foreground/70" />
				</div>
			</div>

			{/* Chart */}
			<div className="p-4 pt-2">
				<ChartContainer config={chartConfig} className="h-[220px] w-full">
					<BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
						<CartesianGrid
							strokeDasharray="3 3"
							className="stroke-border/50"
							vertical={false}
						/>
						<XAxis
							dataKey="plan"
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
							cursor={{ fill: "var(--muted)", opacity: 0.3 }}
						/>
						<Bar dataKey="users" radius={[6, 6, 0, 0]}>
							{data.map((entry, index) => {
								const colors = [
									"var(--muted-foreground)",
									"var(--accent-foreground)",
									"var(--foreground)",
								];
								return <Cell key={`cell-${index}`} fill={colors[index]} />;
							})}
						</Bar>
					</BarChart>
				</ChartContainer>

				{/* Legend */}
				<div className="mt-3 flex items-center justify-center gap-4 border-t pt-3">
					{data.map((item, index) => {
						const percentage = total > 0 ? Math.round((item.users / total) * 100) : 0;
						const colors = [
							"bg-muted-foreground",
							"bg-foreground/70",
							"bg-foreground",
						];
						return (
							<div key={item.plan} className="flex items-center gap-1.5 text-xs">
								<div className={`h-2 w-2 rounded-full ${colors[index]}`} />
								<span className="text-muted-foreground">{item.plan}</span>
								<span className="font-medium tabular-nums">{percentage}%</span>
							</div>
						);
					})}
				</div>
			</div>

			{/* Hover overlay */}
			<div className="absolute inset-0 -z-10 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
		</div>
	);
}
