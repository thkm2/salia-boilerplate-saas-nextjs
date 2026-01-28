import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight, Coins } from "lucide-react";
import Link from "next/link";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/shared/components/ui/empty";

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
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>Recent Credit Actions</CardTitle>
					<p className="text-sm text-muted-foreground mt-1">
						Latest actions that consumed credits
					</p>
				</div>
				<Button variant="ghost" size="sm" asChild>
					<Link href="/admin/credit-actions">
						View All
						<ArrowRight className="ml-2 h-4 w-4" />
					</Link>
				</Button>
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
					<div className="space-y-4">
						{actions.map((action) => (
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
				)}
			</CardContent>
		</Card>
	);
}
