import { LayoutDashboard, Users, Activity, TrendingUp, Coins } from "lucide-react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { StatCard } from "@/shared/components/ui/stat-card";

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
			<PageHeader
				icon={LayoutDashboard}
				title="Dashboard"
				description="Overview of your platform metrics"
			/>

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
