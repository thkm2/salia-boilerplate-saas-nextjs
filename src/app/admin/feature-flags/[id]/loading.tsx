import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";

export default function FlagDetailLoading() {
	return (
		<div className="space-y-6 pb-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Skeleton className="h-8 w-8 rounded-md" />
					<Skeleton className="h-7 w-48" />
				</div>
				<Skeleton className="h-9 w-20" />
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-32" />
					</CardHeader>
					<CardContent className="space-y-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="flex justify-between">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-32" />
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-36" />
					</CardHeader>
					<CardContent className="space-y-3">
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="flex items-center gap-3">
								<Skeleton className="h-6 w-6 rounded-full" />
								<Skeleton className="h-4 flex-1" />
								<Skeleton className="h-6 w-6" />
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
