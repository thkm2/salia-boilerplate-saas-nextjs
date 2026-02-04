import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
	User,
	Mail,
	Shield,
	CreditCard,
	Coins,
	Flag,
	Clock,
	CalendarCheck,
} from "lucide-react";
import { CopyButton } from "@/shared/components/copy-button";

interface UserInfoCardProps {
	user: {
		id: string;
		email: string;
		role: string;
		plan: string;
		credits: number;
		flagNames: string[];
		firstLoginAt: Date | null;
		lastLoginAt: Date | null;
	};
}

export function UserInfoCard({ user }: UserInfoCardProps) {
	const roleConfig = {
		admin: { variant: "default" as const, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/15" },
		beta: { variant: "secondary" as const, className: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 hover:bg-violet-500/15" },
		user: { variant: "outline" as const, className: "bg-muted/50" },
	};

	const planConfig = {
		pro: { variant: "default" as const, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
		basic: { variant: "secondary" as const, className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
		free: { variant: "outline" as const, className: "bg-muted/50" },
	};

	const role = roleConfig[user.role as keyof typeof roleConfig] ?? roleConfig.user;
	const plan = planConfig[user.plan as keyof typeof planConfig] ?? planConfig.free;

	return (
		<Card className="min-w-0 overflow-hidden gap-4">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
						<User className="h-3.5 w-3.5 text-primary" />
					</div>
					User Information
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-0">
				{/* ID Row */}
				<InfoRow
					icon={<span className="font-mono text-[10px] text-muted-foreground">#</span>}
					label="User ID"
				>
					<div className="flex items-center gap-1.5">
						<code className="text-xs font-mono text-muted-foreground truncate max-w-[180px]">
							{user.id}
						</code>
						<CopyButton value={user.id} />
					</div>
				</InfoRow>

				{/* Email Row */}
				<InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email">
					<div className="flex items-center gap-1.5">
						<span className="text-sm truncate max-w-[200px]">{user.email}</span>
						<CopyButton value={user.email} />
					</div>
				</InfoRow>

				{/* Role & Plan Row */}
				<InfoRow icon={<Shield className="h-3.5 w-3.5" />} label="Role">
					<Badge
						variant={role.variant}
						className={`${role.className} font-medium capitalize transition-colors`}
					>
						{user.role}
					</Badge>
				</InfoRow>

				<InfoRow icon={<CreditCard className="h-3.5 w-3.5" />} label="Plan">
					<Badge
						variant={plan.variant}
						className={`${plan.className} font-medium capitalize transition-colors`}
					>
						{user.plan}
					</Badge>
				</InfoRow>

				{/* Credits Row */}
				<InfoRow icon={<Coins className="h-3.5 w-3.5" />} label="Credits">
					<span className="text-sm font-semibold tabular-nums">
						{user.credits.toLocaleString("en-US")}
					</span>
				</InfoRow>

				{/* Feature Flags */}
				<InfoRow
					icon={<Flag className="h-3.5 w-3.5" />}
					label="Feature Flags"
					alignTop
				>
					{user.flagNames.length > 0 ? (
						<div className="flex flex-wrap gap-1.5 justify-end">
							{user.flagNames.map((flag) => (
								<Badge
									key={flag}
									variant="secondary"
									className="font-mono text-[11px] bg-secondary/60"
								>
									{flag}
								</Badge>
							))}
						</div>
					) : (
						<span className="text-sm text-muted-foreground italic">No flags</span>
					)}
				</InfoRow>

				{/* Timestamps */}
				<div className="!mt-4 pt-4 border-t border-dashed space-y-0">
					<InfoRow icon={<CalendarCheck className="h-3.5 w-3.5" />} label="First Login">
						<TimeDisplay date={user.firstLoginAt} />
					</InfoRow>

					<InfoRow icon={<Clock className="h-3.5 w-3.5" />} label="Last Login">
						<TimeDisplay date={user.lastLoginAt} />
					</InfoRow>
				</div>
			</CardContent>
		</Card>
	);
}

function InfoRow({
	icon,
	label,
	children,
	alignTop = false,
}: {
	icon: React.ReactNode;
	label: string;
	children: React.ReactNode;
	alignTop?: boolean;
}) {
	return (
		<div
			className={`flex ${alignTop ? "items-start" : "items-center"} justify-between gap-4 py-2.5 group`}
		>
			<div className="flex items-center gap-2.5 text-muted-foreground shrink-0">
				<span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted/50 text-muted-foreground group-hover:bg-muted transition-colors">
					{icon}
				</span>
				<span className="text-sm">{label}</span>
			</div>
			<div className="min-w-0 text-right">{children}</div>
		</div>
	);
}

function TimeDisplay({ date }: { date: Date | null }) {
	if (!date) {
		return <span className="text-sm text-muted-foreground italic">Never</span>;
	}

	const d = new Date(date);
	const now = new Date();
	const diffMs = now.getTime() - d.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	let relative: string;
	if (diffDays === 0) {
		relative = "Today";
	} else if (diffDays === 1) {
		relative = "Yesterday";
	} else if (diffDays < 7) {
		relative = `${diffDays} days ago`;
	} else if (diffDays < 30) {
		relative = `${Math.floor(diffDays / 7)} weeks ago`;
	} else {
		relative = d.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
		});
	}

	return (
		<div className="flex flex-col items-end">
			<span className="text-sm font-medium">{relative}</span>
			<span className="text-[11px] text-muted-foreground tabular-nums">
				{d.toLocaleString("en-US", {
					month: "short",
					day: "numeric",
					hour: "2-digit",
					minute: "2-digit",
				})}
			</span>
		</div>
	);
}
