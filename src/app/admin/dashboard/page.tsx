import {
	getDashboardStats,
	getPlanDistribution,
	getUserGrowth,
	getRecentUsers,
	getRecentCreditActions,
} from "./data";
import { PlanDistributionChart } from "./_components/plan-distribution-chart";
import { UserGrowthChart } from "./_components/user-growth-chart";
import { RecentUsersList } from "./_components/recent-users-list";
import { CreditActionsList } from "./_components/credit-actions-list";
import { DashboardHeader } from "./_components/dashboard-header";

const AdminDashboardPage = async () => {
	// Fetch all data in parallel
	const [stats, planDistribution, userGrowthMonth, recentUsers, recentActions] =
		await Promise.all([
			getDashboardStats(),
			getPlanDistribution(),
			getUserGrowth(),
			getRecentUsers(),
			getRecentCreditActions(),
		]);

	return (
		<div className="space-y-6 pb-8">
			<DashboardHeader stats={stats} />

			{/* Charts Section */}
			<div className="grid gap-4 md:grid-cols-2">
				<PlanDistributionChart data={planDistribution} />
				<UserGrowthChart data={userGrowthMonth} />
			</div>

			{/* Activity Lists */}
			<div className="grid gap-4 lg:grid-cols-2">
				<RecentUsersList users={recentUsers} />
				<CreditActionsList actions={recentActions} />
			</div>
		</div>
	);
};

export default AdminDashboardPage;
