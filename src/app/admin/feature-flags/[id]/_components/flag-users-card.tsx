"use client";

import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	EmptyDescription,
} from "@/shared/components/ui/empty";
import { toast } from "sonner";
import { Users, UserMinus, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { unassignFlagFromUser } from "@/shared/actions/feature-flags";

interface AssignedUser {
	id: string;
	name: string;
	email: string;
	image: string | null;
	assignedAt: Date;
}

interface FlagUsersCardProps {
	flagId: string;
	users: AssignedUser[];
}

export function FlagUsersCard({ flagId, users }: FlagUsersCardProps) {
	return (
		<Card className="min-w-0 overflow-hidden gap-4">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-base">
						<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
							<Users className="h-3.5 w-3.5 text-primary" />
						</div>
						Assigned Users
					</div>
					<Badge
						variant="secondary"
						className="font-mono text-xs bg-muted/50"
					>
						{users.length}
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{users.length === 0 ? (
					<Empty className="py-6">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<Users className="h-5 w-5" />
							</EmptyMedia>
							<EmptyTitle>No users assigned</EmptyTitle>
							<EmptyDescription>
								Assign users to this flag from their profile page.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : (
					<div className="space-y-1">
						{users.map((user) => (
							<UserRow key={user.id} user={user} flagId={flagId} />
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function UserRow({ user, flagId }: { user: AssignedUser; flagId: string }) {
	const [isPending, startTransition] = useTransition();

	const initials = user.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const assignedDate = new Date(user.assignedAt);
	const now = new Date();
	const diffMs = now.getTime() - assignedDate.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	let assignedRelative: string;
	if (diffDays === 0) {
		assignedRelative = "Today";
	} else if (diffDays === 1) {
		assignedRelative = "Yesterday";
	} else if (diffDays < 7) {
		assignedRelative = `${diffDays}d ago`;
	} else if (diffDays < 30) {
		assignedRelative = `${Math.floor(diffDays / 7)}w ago`;
	} else {
		assignedRelative = assignedDate.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	}

	const handleUnassign = () => {
		startTransition(async () => {
			try {
				await unassignFlagFromUser({
					userId: user.id,
					flagId,
				});
				toast.success(`Removed ${user.name} from flag`);
			} catch {
				toast.error("Failed to remove user");
			}
		});
	};

	return (
		<div className="flex items-center justify-between gap-3 py-2.5 px-3 -mx-3 rounded-lg group hover:bg-muted/50 transition-colors">
			<Link
				href={`/admin/users/${user.id}`}
				className="flex items-center gap-3 min-w-0 flex-1"
			>
				<Avatar size="sm" className="ring-2 ring-background">
					<AvatarImage src={user.image ?? undefined} alt={user.name} />
					<AvatarFallback className="text-[10px] font-medium">
						{initials}
					</AvatarFallback>
				</Avatar>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
							{user.name}
						</p>
						<ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
					</div>
					<p className="text-xs text-muted-foreground truncate">
						{user.email}
					</p>
				</div>
			</Link>
			<div className="flex items-center gap-3 shrink-0">
				<span className="text-[11px] text-muted-foreground tabular-nums hidden sm:block">
					{assignedRelative}
				</span>
				<Button
					variant="ghost"
					size="icon-sm"
					disabled={isPending}
					onClick={handleUnassign}
					className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
				>
					{isPending ? (
						<Loader2 className="h-3.5 w-3.5 animate-spin" />
					) : (
						<UserMinus className="h-3.5 w-3.5" />
					)}
				</Button>
			</div>
		</div>
	);
}
