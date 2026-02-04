import { Skeleton } from "@/shared/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="space-y-8">
			<div>
				<Skeleton className="h-8 w-24 mb-2" />
				<Skeleton className="h-5 w-64" />
			</div>

			<div className="rounded-lg border bg-card p-6 space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-2">
						<Skeleton className="h-5 w-24" />
						<Skeleton className="h-4 w-32" />
					</div>
					<Skeleton className="h-9 w-36" />
				</div>
			</div>

			<div>
				<Skeleton className="h-6 w-32 mb-4" />
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3].map((i) => (
						<div key={i} className="rounded-lg border bg-card p-6 space-y-4">
							<div className="space-y-2">
								<Skeleton className="h-6 w-20" />
								<Skeleton className="h-8 w-24" />
							</div>
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-9 w-full" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
