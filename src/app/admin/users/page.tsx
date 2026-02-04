import { getUsers, getUsersStats } from "./data";
import { UsersHeader } from "./_components/users-header";
import { UsersFilters } from "./_components/users-filters";
import { UsersTable } from "./_components/users-table";
import { Pagination } from "./_components/pagination";
import { Users, Search } from "lucide-react";
import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	EmptyDescription,
} from "@/shared/components/ui/empty";

const AdminUsersPage = async ({
	searchParams,
}: {
	searchParams: Promise<{
		search?: string;
		role?: string;
		plan?: string;
		page?: string;
	}>;
}) => {
	const params = await searchParams;
	const [{ users, total, totalPages, page }, stats] = await Promise.all([
		getUsers({
			search: params.search,
			role: params.role,
			plan: params.plan,
			page: params.page ? Number(params.page) : 1,
		}),
		getUsersStats(),
	]);

	const hasFilters = params.search || params.role || params.plan;

	return (
		<div className="space-y-6 pb-8">
			<UsersHeader total={total} stats={stats} />
			<UsersFilters />

			{users.length === 0 ? (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							{hasFilters ? (
								<Search className="h-5 w-5" />
							) : (
								<Users className="h-5 w-5" />
							)}
						</EmptyMedia>
						<EmptyTitle>
							{hasFilters ? "No matching users" : "No users yet"}
						</EmptyTitle>
						<EmptyDescription>
							{hasFilters
								? "Try adjusting your search or filters to find what you're looking for."
								: "Users will appear here once they register."}
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : (
				<div className="space-y-4">
					<UsersTable users={users} />
					<Pagination page={page} totalPages={totalPages} total={total} />
				</div>
			)}
		</div>
	);
};

export default AdminUsersPage;
