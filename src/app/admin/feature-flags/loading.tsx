import { Skeleton } from "@/shared/components/ui/skeleton";

export default function FeatureFlagsLoading() {
	return (
		<div className="space-y-6 pb-8">
			{/* Header */}
			<div className="space-y-6">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<Skeleton className="h-10 w-10 rounded-lg" />
						<div className="space-y-1">
							<Skeleton className="h-7 w-32" />
							<Skeleton className="h-4 w-40" />
						</div>
					</div>
					<Skeleton className="h-9 w-28 rounded-md" />
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="rounded-xl border bg-card p-4"
						>
							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<Skeleton className="h-3 w-20" />
									<Skeleton className="h-7 w-12" />
								</div>
								<Skeleton className="h-10 w-10 rounded-lg" />
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Table */}
			<div className="rounded-xl border bg-card overflow-hidden">
				<div className="p-4 space-y-4">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="flex items-center gap-4">
							<Skeleton className="h-9 w-9 rounded-lg" />
							<div className="flex-1 space-y-1">
								<Skeleton className="h-4 w-28" />
								<Skeleton className="h-3 w-48" />
							</div>
							<Skeleton className="h-5 w-16 rounded-full" />
							<Skeleton className="h-4 w-12" />
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-8 w-8 rounded-md" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
