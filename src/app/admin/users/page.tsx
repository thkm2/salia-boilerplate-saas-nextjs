import { getUsers } from "./data";
import { UsersHeader } from "./_components/users-header";
import { UsersFilters } from "./_components/users-filters";
import { UsersTable } from "./_components/users-table";
import { Pagination } from "./_components/pagination";
import { Users } from "lucide-react";
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
	const { users, total, totalPages, page } = await getUsers({
		search: params.search,
		role: params.role,
		plan: params.plan,
		page: params.page ? Number(params.page) : 1,
	});

	return (
		<div className="space-y-6 pb-6">
			<UsersHeader total={total} />
			<UsersFilters />

			{users.length === 0 ? (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Users className="h-5 w-5" />
						</EmptyMedia>
						<EmptyTitle>No users found</EmptyTitle>
						<EmptyDescription>
							{params.search || params.role || params.plan
								? "Try adjusting your search or filters."
								: "Users will appear here once they register."}
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : (
				<>
					<UsersTable users={users} />
					<Pagination page={page} totalPages={totalPages} total={total} />
				</>
			)}
		</div>
	);
};

export default AdminUsersPage;
