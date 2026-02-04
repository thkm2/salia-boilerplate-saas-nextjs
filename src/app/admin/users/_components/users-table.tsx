import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import Link from "next/link";
import { Shield, FlaskConical, Crown, ChevronRight, Coins } from "lucide-react";
import { formatRelativeDate } from "@/shared/utils/format-date";

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

function RoleBadge({ role }: { role: string }) {
	const config = {
		admin: {
			icon: Shield,
			label: "Admin",
			className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
		},
		beta: {
			icon: FlaskConical,
			label: "Beta",
			className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-purple-500/20",
		},
		user: {
			icon: null,
			label: "User",
			className: "bg-muted text-muted-foreground ring-border",
		},
	}[role] ?? {
		icon: null,
		label: role,
		className: "bg-muted text-muted-foreground ring-border",
	};

	const Icon = config.icon;

	return (
		<span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${config.className}`}>
			{Icon && <Icon className="h-3 w-3" />}
			{config.label}
		</span>
	);
}

function PlanBadge({ plan }: { plan: string }) {
	const config = {
		pro: {
			icon: Crown,
			label: "Pro",
			className: "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
		},
		basic: {
			icon: null,
			label: "Basic",
			className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20",
		},
		free: {
			icon: null,
			label: "Free",
			className: "bg-muted text-muted-foreground ring-border",
		},
	}[plan] ?? {
		icon: null,
		label: plan,
		className: "bg-muted text-muted-foreground ring-border",
	};

	const Icon = config.icon;

	return (
		<span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${config.className}`}>
			{Icon && <Icon className="h-3 w-3" />}
			{config.label}
		</span>
	);
}

export function UsersTable({ users }: { users: UserRow[] }) {
	return (
		<div className="rounded-xl border bg-card overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="bg-muted/30 hover:bg-muted/30">
						<TableHead className="min-w-[240px] font-semibold">User</TableHead>
						<TableHead className="w-[100px] font-semibold">Role</TableHead>
						<TableHead className="w-[100px] font-semibold">Plan</TableHead>
						<TableHead className="w-[120px] font-semibold">
							<span className="flex items-center gap-1.5">
								<Coins className="h-3.5 w-3.5 text-muted-foreground" />
								Credits
							</span>
						</TableHead>
						<TableHead className="w-[100px] font-semibold">Last Active</TableHead>
						<TableHead className="w-[100px] font-semibold">Joined</TableHead>
						<TableHead className="w-[40px]"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((u, index) => {
						const initials = u.name
							.split(" ")
							.map((n) => n[0])
							.join("")
							.toUpperCase()
							.slice(0, 2);

						return (
							<TableRow
								key={u.id}
								className="group cursor-pointer transition-colors hover:bg-muted/50"
								style={{ animationDelay: `${index * 30}ms` }}
							>
								<TableCell>
									<Link
										href={`/admin/users/${u.id}`}
										className="flex items-center gap-3"
									>
										<div className="relative">
											<Avatar size="sm" className="ring-2 ring-background shadow-sm">
												<AvatarImage
													src={u.image ?? undefined}
													alt={u.name}
												/>
												<AvatarFallback className="bg-gradient-to-br from-foreground/5 to-foreground/10 text-xs font-semibold">
													{initials}
												</AvatarFallback>
											</Avatar>
											{/* Online indicator for recent activity */}
											{u.lastLoginAt &&
												new Date().getTime() - new Date(u.lastLoginAt).getTime() < 24 * 60 * 60 * 1000 && (
												<span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-card" />
											)}
										</div>
										<div className="min-w-0">
											<p className="font-medium text-sm truncate group-hover:text-foreground transition-colors">
												{u.name}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{u.email}
											</p>
										</div>
									</Link>
								</TableCell>
								<TableCell>
									<RoleBadge role={u.role} />
								</TableCell>
								<TableCell>
									<PlanBadge plan={u.plan} />
								</TableCell>
								<TableCell>
									<span className={`font-mono text-sm tabular-nums ${
										u.credits === 0
											? "text-muted-foreground"
											: u.credits < 10
												? "text-amber-600 dark:text-amber-400"
												: "text-foreground"
									}`}>
										{u.credits.toLocaleString("en-US")}
									</span>
								</TableCell>
								<TableCell>
									<span className="text-sm text-muted-foreground">
										{formatRelativeDate(u.lastLoginAt)}
									</span>
								</TableCell>
								<TableCell>
									<span className="text-sm text-muted-foreground">
										{formatRelativeDate(u.firstLoginAt)}
									</span>
								</TableCell>
								<TableCell>
									<ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
