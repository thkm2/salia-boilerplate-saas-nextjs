import { notFound } from "next/navigation";
import { getUserById, getUserCreditTransactions } from "./data";
import { UserDetailHeader } from "./_components/user-detail-header";
import { UserInfoCard } from "./_components/user-info-card";
import { UserActionsCard } from "./_components/user-actions-card";
import { CreditHistory } from "./_components/credit-history";

const AdminUserDetailPage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;

	const [userData, creditData] = await Promise.all([
		getUserById(id),
		getUserCreditTransactions(id),
	]);

	if (!userData) {
		notFound();
	}

	return (
		<div className="space-y-6 pb-6">
			<UserDetailHeader
				name={userData.name}
				email={userData.email}
				image={userData.image}
			/>

			<div className="grid gap-6 md:grid-cols-2">
				<UserInfoCard user={userData} />
				<UserActionsCard
					userId={userData.id}
					role={userData.role}
					featureFlags={userData.featureFlags}
				/>
			</div>

			<CreditHistory
				userId={userData.id}
				initialTransactions={creditData.transactions}
				hasMore={creditData.hasMore}
			/>
		</div>
	);
};

export default AdminUserDetailPage;
