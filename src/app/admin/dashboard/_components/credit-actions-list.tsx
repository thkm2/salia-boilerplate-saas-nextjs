"use client";

import { Button } from "@/shared/components/ui/button";
import { Coins, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	EmptyDescription,
} from "@/shared/components/ui/empty";
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
		<div className="group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md hover:border-foreground/20">
			{/* Header */}
			<div className="flex items-center justify-between p-4 pb-3">
				<div className="space-y-1">
					<h3 className="font-semibold tracking-tight">Credit Activity</h3>
					<p className="text-sm text-muted-foreground">
						Recent transactions
					</p>
				</div>
				<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 ring-1 ring-foreground/10">
					<Coins className="h-4 w-4 text-foreground/70" />
				</div>
			</div>

			{/* Content */}
			<div className="px-4 pb-4">
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
						<div className="space-y-1">
							{displayedActions.map((action) => {
								const isPositive = action.credits > 0;
								return (
									<div
										key={action.id}
										className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
									>
										<div className="flex items-center gap-3 min-w-0">
											{/* Transaction indicator */}
											<div
												className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ${
													isPositive
														? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400"
														: "bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400"
												}`}
											>
												{isPositive ? (
													<ArrowUpRight className="h-4 w-4" />
												) : (
													<ArrowDownLeft className="h-4 w-4" />
												)}
											</div>
											<div className="min-w-0">
												<p className="truncate text-sm font-medium">
													{action.action}
												</p>
												<p className="truncate text-xs text-muted-foreground">
													{action.user}
												</p>
											</div>
										</div>
										<div className="shrink-0 text-right">
											<p
												className={`text-sm font-semibold tabular-nums ${
													isPositive
														? "text-emerald-600 dark:text-emerald-400"
														: "text-red-600 dark:text-red-400"
												}`}
											>
												{isPositive ? "+" : ""}
												{action.credits}
											</p>
											<p className="text-xs text-muted-foreground">
												{action.date}
											</p>
										</div>
									</div>
								);
							})}
						</div>

						{actions.length > 5 && (
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
											Show {actions.length - 5} More
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
