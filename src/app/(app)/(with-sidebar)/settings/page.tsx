import { requireAuth } from "@/lib/auth/guards";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { PLANS, type PlanId } from "@/lib/plans";
import { DeleteAccountCard } from "./_components/delete-account-card";
import {
	Settings,
	User,
	Mail,
	CreditCard,
	Coins,
	CalendarDays,
	Crown,
} from "lucide-react";

function formatDate(date: Date | string | null | undefined): string {
	if (!date) return "---";
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function InfoRow({
	icon,
	label,
	children,
}: {
	icon: React.ReactNode;
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-4 py-2.5 group">
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

function PlanBadge({ plan }: { plan: string }) {
	const config = {
		pro: {
			icon: Crown,
			className:
				"bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
		},
		basic: {
			icon: null,
			className:
				"bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
		},
		free: {
			icon: null,
			className: "bg-muted/50 text-muted-foreground border-border",
		},
	}[plan] ?? {
		icon: null,
		className: "bg-muted/50 text-muted-foreground border-border",
	};

	const Icon = config.icon;

	return (
		<Badge variant="outline" className={`${config.className} font-medium`}>
			{Icon && <Icon className="h-3 w-3 mr-1" />}
			{plan.charAt(0).toUpperCase() + plan.slice(1)}
		</Badge>
	);
}

export default async function SettingsPage() {
	const session = await requireAuth();
	const { user } = session;
	const planConfig = PLANS[user.plan as PlanId] ?? PLANS.free;

	const initials = user.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 ring-1 ring-foreground/10">
							<Settings className="h-5 w-5 text-foreground/70" />
						</div>
						<div>
							<h1 className="text-2xl font-semibold tracking-tight">
								Settings
							</h1>
							<p className="text-sm text-muted-foreground">
								Manage your account and preferences
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Profile Card */}
			<Card className="overflow-hidden shadow-xs">
				<CardHeader>
					<div className="flex items-center gap-4">
						<div className="relative">
							<Avatar className="h-16 w-16 ring-4 ring-background shadow-lg">
								<AvatarImage src={user.image ?? undefined} alt={user.name} />
								<AvatarFallback className="bg-gradient-to-br from-foreground/5 to-foreground/10 text-base font-semibold">
									{initials}
								</AvatarFallback>
							</Avatar>
						</div>
						<div className="space-y-1">
							<div className="flex items-center gap-2.5">
								<h2 className="text-lg font-semibold">{user.name}</h2>
								<PlanBadge plan={user.plan} />
							</div>
							<div className="flex items-center gap-1.5 text-muted-foreground">
								<Mail className="h-3.5 w-3.5" />
								<p className="text-sm">{user.email}</p>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="border-t pt-4 space-y-0">
						<InfoRow
							icon={<User className="h-3.5 w-3.5" />}
							label="Full Name"
						>
							<span className="text-sm font-medium">{user.name}</span>
						</InfoRow>

						<InfoRow
							icon={<Mail className="h-3.5 w-3.5" />}
							label="Email"
						>
							<span className="text-sm truncate max-w-[200px]">
								{user.email}
							</span>
						</InfoRow>

						<InfoRow
							icon={<CreditCard className="h-3.5 w-3.5" />}
							label="Plan"
						>
							<PlanBadge plan={user.plan} />
						</InfoRow>

						<InfoRow
							icon={<Coins className="h-3.5 w-3.5" />}
							label="Credits"
						>
							<span className="text-sm font-semibold tabular-nums">
								{user.credits.toLocaleString("en-US")}
								<span className="text-muted-foreground font-normal ml-1">
									/ {planConfig.credits}
								</span>
							</span>
						</InfoRow>

						<InfoRow
							icon={<CalendarDays className="h-3.5 w-3.5" />}
							label="Member since"
						>
							<span className="text-sm">{formatDate(user.createdAt)}</span>
						</InfoRow>
					</div>
				</CardContent>
			</Card>

			{/* Delete Account */}
			<DeleteAccountCard userEmail={user.email} />
		</div>
	);
}
