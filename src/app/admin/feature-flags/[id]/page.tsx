import { notFound } from "next/navigation";
import { getFeatureFlagById, getFlagAssignedUsers } from "../data";
import { FlagDetailHeader } from "./_components/flag-detail-header";
import { FlagInfoCard } from "./_components/flag-info-card";
import { FlagUsersCard } from "./_components/flag-users-card";

const FeatureFlagDetailPage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;

	const [flag, users] = await Promise.all([
		getFeatureFlagById(id),
		getFlagAssignedUsers(id),
	]);

	if (!flag) {
		notFound();
	}

	return (
		<div className="space-y-6 pb-6">
			<FlagDetailHeader flagId={flag.id} name={flag.name} />

			<div className="grid gap-6 md:grid-cols-2">
				<FlagInfoCard flag={flag} />
				<FlagUsersCard flagId={flag.id} users={users} />
			</div>
		</div>
	);
};

export default FeatureFlagDetailPage;
