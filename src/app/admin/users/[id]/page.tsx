import { notFound } from "next/navigation";
import { getUserById, getUserCreditTransactions } from "./data";
import { getAllFlagsForUser } from "../../feature-flags/data";
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

	const [userData, creditData, flags] = await Promise.all([
		getUserById(id),
		getUserCreditTransactions(id),
		getAllFlagsForUser(id),
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
				<UserInfoCard user={{
					...userData,
					flagNames: flags.filter((f) => f.assigned && f.enabled).map((f) => f.name),
				}} />
				<UserActionsCard
					userId={userData.id}
					role={userData.role}
					flags={flags}
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
