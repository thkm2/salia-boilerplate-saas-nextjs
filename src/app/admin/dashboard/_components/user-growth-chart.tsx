"use client";

import {
	Line,
	LineChart,
	XAxis,
	YAxis,
	CartesianGrid,
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

interface UserGrowthChartProps {
	data: { label: string; users: number }[];
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
	return (
		<ChartContainer config={chartConfig} className="h-[300px] w-full">
			<LineChart data={data}>
				<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
				<XAxis
					dataKey="label"
					className="text-xs"
					tick={{ fill: "hsl(var(--muted-foreground))" }}
				/>
				<YAxis
					className="text-xs"
					tick={{ fill: "hsl(var(--muted-foreground))" }}
				/>
				<ChartTooltip content={<ChartTooltipContent />} />
				<Line
					type="monotone"
					dataKey="users"
					stroke="#3b82f6"
					strokeWidth={3}
					dot={false}
					activeDot={{ r: 6, fill: "#2563eb" }}
				/>
			</LineChart>
		</ChartContainer>
	);
}
