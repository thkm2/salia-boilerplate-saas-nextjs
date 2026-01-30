"use client";

import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { X } from "lucide-react";
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
	const [isPending, startTransition] = useTransition();

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Assigned Users ({users.length})
				</CardTitle>
			</CardHeader>
			<CardContent>
				{users.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						No users assigned to this flag.
					</p>
				) : (
					<div className="space-y-3">
						{users.map((u) => {
							const initials = u.name
								.split(" ")
								.map((n) => n[0])
								.join("")
								.toUpperCase()
								.slice(0, 2);

							return (
								<div
									key={u.id}
									className="flex items-center justify-between gap-3"
								>
									<Link
										href={`/admin/users/${u.id}`}
										className="flex items-center gap-3 min-w-0 hover:underline"
									>
										<Avatar size="sm">
											<AvatarImage
												src={u.image ?? undefined}
												alt={u.name}
											/>
											<AvatarFallback>{initials}</AvatarFallback>
										</Avatar>
										<div className="min-w-0">
											<p className="text-sm font-medium truncate">
												{u.name}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{u.email}
											</p>
										</div>
									</Link>
									<Button
										variant="ghost"
										size="icon-sm"
										disabled={isPending}
										onClick={() => {
											startTransition(async () => {
												try {
													await unassignFlagFromUser({
														userId: u.id,
														flagId,
													});
													toast.success(
														`Removed ${u.name} from flag`,
													);
												} catch {
													toast.error("Failed to remove user");
												}
											});
										}}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							);
						})}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
