"use client";

import { Button } from "@/shared/components/ui/button";
import { Users, ChevronDown, ChevronUp } from "lucide-react";
import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	EmptyDescription,
} from "@/shared/components/ui/empty";
import { useState } from "react";

interface RecentUser {
	id: string;
	name: string;
	email: string;
	plan: string;
	isPaid: boolean;
	date: string;
}

interface RecentUsersListProps {
	users: RecentUser[];
}

export function RecentUsersList({ users }: RecentUsersListProps) {
	const [showMore, setShowMore] = useState(false);
	const displayedUsers = showMore ? users : users.slice(0, 5);

	return (
		<div className="group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md hover:border-foreground/20">
			{/* Header */}
			<div className="flex items-center justify-between p-4 pb-3">
				<div className="space-y-1">
					<h3 className="font-semibold tracking-tight">Recent Users</h3>
					<p className="text-sm text-muted-foreground">
						Latest registrations
					</p>
				</div>
				<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 ring-1 ring-foreground/10">
					<Users className="h-4 w-4 text-foreground/70" />
				</div>
			</div>

			{/* Content */}
			<div className="px-4 pb-4">
				{users.length === 0 ? (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<Users className="h-5 w-5" />
							</EmptyMedia>
							<EmptyTitle>No users yet</EmptyTitle>
							<EmptyDescription>
								Users will appear here once they register on the platform.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : (
					<>
						<div className="space-y-1">
							{displayedUsers.map((user) => (
								<div
									key={user.id}
									className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
								>
									<div className="flex items-center gap-3 min-w-0">
										{/* Avatar placeholder */}
										<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-xs font-medium uppercase text-foreground/70 ring-1 ring-foreground/10">
											{user.name.charAt(0)}
										</div>
										<div className="min-w-0">
											<div className="flex items-center gap-2">
												<p className="truncate text-sm font-medium">
													{user.name}
												</p>
												{user.isPaid && (
													<span className="shrink-0 rounded bg-foreground px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-background">
														Paid
													</span>
												)}
											</div>
											<p className="truncate text-xs text-muted-foreground">
												{user.email}
											</p>
										</div>
									</div>
									<div className="shrink-0 text-right">
										<p className="text-sm font-medium">{user.plan}</p>
										<p className="text-xs text-muted-foreground">{user.date}</p>
									</div>
								</div>
							))}
						</div>

						{users.length > 5 && (
							<div className="mt-3 border-t pt-3">
								<Button
									variant="ghost"
									size="sm"
									className="w-full gap-2 text-muted-foreground hover:text-foreground"
									onClick={() => setShowMore(!showMore)}
								>
									{showMore ? (
										<>
											<ChevronUp className="h-4 w-4" />
											Show Less
										</>
									) : (
										<>
											<ChevronDown className="h-4 w-4" />
											Show {users.length - 5} More
										</>
									)}
								</Button>
							</div>
						)}
					</>
				)}
			</div>

			{/* Hover overlay */}
			<div className="absolute inset-0 -z-10 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
		</div>
	);
}
