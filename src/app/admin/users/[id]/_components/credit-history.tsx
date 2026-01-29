"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	EmptyDescription,
} from "@/shared/components/ui/empty";
import { Receipt } from "lucide-react";
import { getUserCreditTransactions } from "../data";

interface Transaction {
	id: string;
	amount: number;
	type: string;
	description: string | null;
	metadata: string | null;
	createdAt: Date;
}

interface CreditHistoryProps {
	userId: string;
	initialTransactions: Transaction[];
	hasMore: boolean;
}

export function CreditHistory({
	userId,
	initialTransactions,
	hasMore: initialHasMore,
}: CreditHistoryProps) {
	const [transactions, setTransactions] =
		useState<Transaction[]>(initialTransactions);
	const [hasMore, setHasMore] = useState(initialHasMore);
	const [page, setPage] = useState(1);
	const [isPending, startTransition] = useTransition();

	const loadMore = () => {
		const nextPage = page + 1;
		startTransition(async () => {
			const data = await getUserCreditTransactions(userId, nextPage);
			setTransactions((prev) => [...prev, ...data.transactions]);
			setHasMore(data.hasMore);
			setPage(nextPage);
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Credit History</CardTitle>
			</CardHeader>
			<CardContent>
				{transactions.length === 0 ? (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<Receipt className="h-5 w-5" />
							</EmptyMedia>
							<EmptyTitle>No transactions</EmptyTitle>
							<EmptyDescription>
								Credit transactions will appear here.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : (
					<div className="space-y-3">
						{transactions.map((t) => (
							<div
								key={t.id}
								className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
							>
								<div className="space-y-0.5">
									<p className="text-sm font-medium">
										{t.description ||
											t.type
												.split("_")
												.map(
													(w) =>
														w.charAt(0).toUpperCase() + w.slice(1),
												)
												.join(" ")}
									</p>
									<p className="text-xs text-muted-foreground">
										{new Date(t.createdAt).toLocaleString()}
									</p>
								</div>
								<Badge
									variant={t.amount > 0 ? "default" : "destructive"}
								>
									{t.amount > 0 ? "+" : ""}
									{t.amount}
								</Badge>
							</div>
						))}

						{hasMore && (
							<div className="flex justify-center pt-2">
								<Button
									variant="ghost"
									size="sm"
									disabled={isPending}
									onClick={loadMore}
								>
									{isPending ? "Loading..." : "Load More"}
								</Button>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
