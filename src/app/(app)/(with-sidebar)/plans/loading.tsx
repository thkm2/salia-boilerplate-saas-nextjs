import { Skeleton } from "@/shared/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center gap-3">
				<Skeleton className="h-10 w-10 rounded-lg" />
				<div className="space-y-1">
					<Skeleton className="h-7 w-32" />
					<Skeleton className="h-4 w-52" />
				</div>
			</div>

			{/* Current Plan Card with circular gauge */}
			<div className="rounded-2xl border bg-card p-6">
				<div className="flex flex-col lg:flex-row lg:items-center gap-6">
					{/* Left: Credit Gauge */}
					<div className="flex items-center gap-5">
						<Skeleton className="h-24 w-24 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-8 w-24" />
							<Skeleton className="h-3 w-28" />
						</div>
					</div>

					<Skeleton className="hidden lg:block w-px h-20" />
					<Skeleton className="lg:hidden h-px w-full" />

					{/* Right: Plan info */}
					<div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-5 w-14 rounded-full" />
							</div>
							<Skeleton className="h-3 w-36" />
						</div>
						<Skeleton className="h-9 w-28" />
					</div>
				</div>
			</div>

			{/* Available Plans */}
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
