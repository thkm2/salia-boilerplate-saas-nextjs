import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import Link from "next/link";

interface UserRow {
	id: string;
	name: string;
	email: string;
	image: string | null;
	role: string;
	plan: string;
	credits: number;
	lastLoginAt: Date | null;
	firstLoginAt: Date | null;
}

const roleBadgeVariant = (role: string) => {
	switch (role) {
		case "admin":
			return "default" as const;
		case "beta":
			return "secondary" as const;
		default:
			return "outline" as const;
	}
};

const planBadgeVariant = (plan: string) => {
	switch (plan) {
		case "pro":
		case "admin":
			return "default" as const;
		case "basic":
			return "secondary" as const;
		default:
			return "outline" as const;
	}
};

export function UsersTable({ users }: { users: UserRow[] }) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="min-w-[200px]">User</TableHead>
						<TableHead className="w-[90px]">Role</TableHead>
						<TableHead className="w-[90px]">Plan</TableHead>
						<TableHead className="w-[100px] text-right pr-6">Credits</TableHead>
						<TableHead className="w-[120px]">Last Login</TableHead>
						<TableHead className="w-[120px]">First Login</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((u) => {
						const initials = u.name
							.split(" ")
							.map((n) => n[0])
							.join("")
							.toUpperCase()
							.slice(0, 2);

						return (
							<TableRow key={u.id} className="cursor-pointer">
								<TableCell>
									<Link
										href={`/admin/users/${u.id}`}
										className="flex items-center gap-3"
									>
										<Avatar size="sm">
											<AvatarImage
												src={u.image ?? undefined}
												alt={u.name}
											/>
											<AvatarFallback>{initials}</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium text-sm">{u.name}</p>
											<p className="text-xs text-muted-foreground">
												{u.email}
											</p>
										</div>
									</Link>
								</TableCell>
								<TableCell>
									<Badge variant={roleBadgeVariant(u.role)}>{u.role}</Badge>
								</TableCell>
								<TableCell>
									<Badge variant={planBadgeVariant(u.plan)}>{u.plan}</Badge>
								</TableCell>
								<TableCell className="text-right font-medium pr-6">
									{u.credits.toLocaleString()}
								</TableCell>
								<TableCell className="text-sm text-muted-foreground">
									{u.lastLoginAt
										? new Date(u.lastLoginAt).toLocaleDateString()
										: "Never"}
								</TableCell>
								<TableCell className="text-sm text-muted-foreground">
									{u.firstLoginAt
										? new Date(u.firstLoginAt).toLocaleDateString()
										: "Never"}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
