"use client";

import {
	Bar,
	BarChart,
	XAxis,
	YAxis,
	CartesianGrid,
	Cell,
} from "recharts";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/shared/components/ui/chart";

const chartConfig = {
	users: {
		label: "Users",
	},
} satisfies ChartConfig;

interface PlanDistributionChartProps {
	data: { plan: string; users: number }[];
}

export function PlanDistributionChart({ data }: PlanDistributionChartProps) {
	return (
		<ChartContainer config={chartConfig} className="h-[300px] w-full">
			<BarChart data={data}>
				<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
				<XAxis
					dataKey="plan"
					className="text-xs"
					tick={{ fill: "hsl(var(--muted-foreground))" }}
				/>
				<YAxis
					className="text-xs"
					tick={{ fill: "hsl(var(--muted-foreground))" }}
				/>
				<ChartTooltip content={<ChartTooltipContent />} />
				<Bar dataKey="users" radius={[4, 4, 0, 0]}>
					{data.map((entry, index) => {
						const colors = ["#93c5fd", "#3b82f6", "#1e40af"];
						return <Cell key={`cell-${index}`} fill={colors[index]} />;
					})}
				</Bar>
			</BarChart>
		</ChartContainer>
	);
}
