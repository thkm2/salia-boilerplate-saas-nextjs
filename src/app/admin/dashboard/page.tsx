import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Users, Activity } from "lucide-react";
import {
	getTotalUsers,
	getActiveUsers,
	getPlanDistribution,
	getUserGrowth,
	getRecentUsers,
	getRecentCreditActions,
} from "./data";
import { PlanDistributionChart } from "./_components/plan-distribution-chart";
import { UserGrowthChart } from "./_components/user-growth-chart";
import { RecentUsersList } from "./_components/recent-users-list";
import { CreditActionsList } from "./_components/credit-actions-list";

const AdminDashboardPage = async () => {
	// Fetch all data in parallel
	const [
		totalUsers,
		activeUsersMonth,
		planDistribution,
		userGrowthMonth,
		recentUsers,
		recentActions,
	] = await Promise.all([
		getTotalUsers(),
		getActiveUsers(),
		getPlanDistribution(),
		getUserGrowth(),
		getRecentUsers(),
		getRecentCreditActions(),
	]);

	return (
		<div className="space-y-8 py-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground mt-1">
					Overview of your platform metrics
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2">
				{/* Total Users Card */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">
							{totalUsers.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Registered users on the platform
						</p>
					</CardContent>
				</Card>

				{/* Active Users Card */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Users</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">
							{activeUsersMonth.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Active in the last 30 days
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Plan Distribution & User Growth */}
			<div className="grid gap-4 md:grid-cols-2">
				{/* Plan Distribution */}
				<Card>
					<CardHeader>
						<CardTitle>Plan Distribution</CardTitle>
						<p className="text-sm text-muted-foreground">Users by plan type</p>
					</CardHeader>
					<CardContent>
						<PlanDistributionChart data={planDistribution} />
					</CardContent>
				</Card>

				{/* User Growth */}
				<Card>
					<CardHeader>
						<CardTitle>User Growth</CardTitle>
						<p className="text-sm text-muted-foreground">
							New registrations over the last 30 days
						</p>
					</CardHeader>
					<CardContent>
						<UserGrowthChart data={userGrowthMonth} />
					</CardContent>
				</Card>
			</div>

			{/* Recent Users */}
			<RecentUsersList users={recentUsers} />

			{/* Recent Credit Actions */}
			<CreditActionsList actions={recentActions} />
		</div>
	);
};

export default AdminDashboardPage;
