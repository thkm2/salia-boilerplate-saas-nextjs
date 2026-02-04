import { Skeleton } from "@/shared/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="space-y-8">
			<div>
				<Skeleton className="h-8 w-32 mb-2" />
				<Skeleton className="h-5 w-48" />
			</div>

			<div className="rounded-lg border bg-card p-6 space-y-6">
				<div className="flex items-center gap-4">
					<Skeleton className="h-16 w-16 rounded-lg" />
					<div className="space-y-2">
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-4 w-48" />
					</div>
				</div>

				<Skeleton className="h-px w-full" />

				<div className="space-y-3">
					<div className="flex items-center gap-4">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-5 w-16" />
					</div>
					<div className="flex items-center gap-4">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-4 w-12" />
					</div>
					<div className="flex items-center gap-4">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-4 w-28" />
					</div>
				</div>
			</div>

			<div className="rounded-lg border border-destructive/50 bg-card p-6 space-y-4">
				<Skeleton className="h-6 w-32" />
				<Skeleton className="h-4 w-64" />
				<Skeleton className="h-9 w-32" />
			</div>
		</div>
	);
}
