import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";

export default function UserDetailLoading() {
	return (
		<div className="space-y-6 pb-6">
			<div className="flex items-center gap-4">
				<Skeleton className="h-8 w-8 rounded-md" />
				<Skeleton className="h-10 w-10 rounded-full" />
				<div>
					<Skeleton className="h-7 w-48" />
					<Skeleton className="h-4 w-32 mt-1" />
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-32" />
					</CardHeader>
					<CardContent className="space-y-3">
						{Array.from({ length: 8 }).map((_, i) => (
							<div key={i} className="flex justify-between">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-32" />
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-24" />
					</CardHeader>
					<CardContent className="space-y-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} className="h-9 w-full" />
						))}
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-32" />
				</CardHeader>
				<CardContent className="space-y-3">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="flex justify-between">
							<Skeleton className="h-4 w-40" />
							<Skeleton className="h-5 w-12" />
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
