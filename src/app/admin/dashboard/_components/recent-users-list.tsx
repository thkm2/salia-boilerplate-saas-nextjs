"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Users } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/shared/components/ui/empty";
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
		<Card>
			<CardHeader>
				<CardTitle>Recent Users</CardTitle>
				<p className="text-sm text-muted-foreground mt-1">
					Latest user registrations
				</p>
			</CardHeader>
			<CardContent>
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
						<div className="space-y-4">
							{displayedUsers.map((user) => (
								<div
									key={user.id}
									className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
								>
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<p className="text-sm font-medium">{user.name}</p>
											{user.isPaid && (
												<span className="text-xs bg-foreground text-background px-2 py-0.5 rounded">
													Paid
												</span>
											)}
										</div>
										<p className="text-xs text-muted-foreground">{user.email}</p>
									</div>
									<div className="text-right space-y-1">
										<p className="text-sm font-medium">{user.plan}</p>
										<p className="text-xs text-muted-foreground">{user.date}</p>
									</div>
								</div>
							))}
						</div>
						{users.length > 5 && (
							<div className="flex justify-center mt-4">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setShowMore(!showMore)}
								>
									{showMore ? "View Less" : "View More"}
								</Button>
							</div>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}
