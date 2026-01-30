import { Skeleton } from "@/shared/components/ui/skeleton";

export default function FeatureFlagsLoading() {
	return (
		<div className="space-y-6 pb-6">
			<div className="flex items-center justify-between">
				<div>
					<Skeleton className="h-9 w-40" />
					<Skeleton className="h-5 w-32 mt-2" />
				</div>
				<Skeleton className="h-9 w-28" />
			</div>

			<div className="rounded-md border">
				<div className="p-4 space-y-4">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="flex items-center gap-4">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 flex-1" />
							<Skeleton className="h-5 w-16" />
							<Skeleton className="h-4 w-12" />
							<Skeleton className="h-4 w-20" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
