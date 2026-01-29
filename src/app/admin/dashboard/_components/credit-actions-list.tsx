"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Coins } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/shared/components/ui/empty";
import { useState } from "react";

interface CreditAction {
	id: string;
	user: string;
	action: string;
	credits: number;
	date: string;
}

interface CreditActionsListProps {
	actions: CreditAction[];
}

export function CreditActionsList({ actions }: CreditActionsListProps) {
	const [showMore, setShowMore] = useState(false);
	const displayedActions = showMore ? actions : actions.slice(0, 5);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Credit Actions</CardTitle>
				<p className="text-sm text-muted-foreground mt-1">
					Latest actions that consumed credits
				</p>
			</CardHeader>
			<CardContent>
				{actions.length === 0 ? (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<Coins className="h-5 w-5" />
							</EmptyMedia>
							<EmptyTitle>No credit actions yet</EmptyTitle>
							<EmptyDescription>
								Credit transactions will appear here once users start using features.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : (
					<>
						<div className="space-y-4">
							{displayedActions.map((action) => (
								<div
									key={action.id}
									className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
								>
									<div className="space-y-1">
										<p className="text-sm font-medium">{action.action}</p>
										<p className="text-xs text-muted-foreground">{action.user}</p>
									</div>
									<div className="text-right space-y-1">
										<p className="text-sm font-medium">{action.credits} credits</p>
										<p className="text-xs text-muted-foreground">{action.date}</p>
									</div>
								</div>
							))}
						</div>
						{actions.length > 5 && (
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
