import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Shield, FlaskConical, Crown, Mail } from "lucide-react";
import Link from "next/link";

interface UserDetailHeaderProps {
	name: string;
	email: string;
	image: string | null;
	role: string;
	plan: string;
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

export function UserDetailHeader({ name, email, image, role, plan }: UserDetailHeaderProps) {
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon-sm" asChild>
					<Link href="/admin/users">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<div className="relative">
					<Avatar size="lg" className="ring-4 ring-background shadow-lg">
						<AvatarImage src={image ?? undefined} alt={name} />
						<AvatarFallback className="bg-gradient-to-br from-foreground/5 to-foreground/10 text-base font-semibold">
							{initials}
						</AvatarFallback>
					</Avatar>
				</div>
				<div className="space-y-1">
					<div className="flex items-center gap-2.5">
						<h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
						<RoleBadge role={role} />
						<PlanBadge plan={plan} />
					</div>
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<Mail className="h-3.5 w-3.5" />
						<p className="text-sm">{email}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
