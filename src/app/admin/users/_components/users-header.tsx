import { Users, UserCheck, UserPlus } from "lucide-react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { StatCard } from "@/shared/components/ui/stat-card";

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
			<PageHeader
				icon={Users}
				title="Users"
				description="Manage your user base"
			/>

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
