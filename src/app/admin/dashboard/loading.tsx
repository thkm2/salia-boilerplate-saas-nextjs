import { Skeleton } from "@/shared/components/ui/skeleton";

export default function DashboardLoading() {
	return (
		<div className="space-y-6 pb-8">
			{/* Header */}
			<div className="space-y-6">
				<div className="flex items-center gap-3">
					<Skeleton className="h-10 w-10 rounded-lg" />
					<div className="space-y-1">
						<Skeleton className="h-7 w-32" />
						<Skeleton className="h-4 w-52" />
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className="rounded-xl border bg-card p-4"
						>
							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<Skeleton className="h-3 w-20" />
									<Skeleton className="h-7 w-16" />
								</div>
								<Skeleton className="h-10 w-10 rounded-lg" />
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Charts Section */}
			<div className="grid gap-4 md:grid-cols-2">
				{Array.from({ length: 2 }).map((_, i) => (
					<div
						key={i}
						className="rounded-xl border bg-card overflow-hidden"
					>
						<div className="flex items-center justify-between p-4 pb-0">
							<div className="space-y-1">
								<Skeleton className="h-5 w-32" />
								<Skeleton className="h-4 w-48" />
							</div>
							<Skeleton className="h-9 w-9 rounded-lg" />
						</div>
						<div className="p-4 pt-2">
							<Skeleton className="h-[220px] w-full rounded-lg" />
							<div className="mt-3 flex items-center justify-between border-t pt-3">
								<Skeleton className="h-4 w-28" />
								<Skeleton className="h-4 w-24" />
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Activity Lists */}
			<div className="grid gap-4 lg:grid-cols-2">
				{Array.from({ length: 2 }).map((_, i) => (
					<div
						key={i}
						className="rounded-xl border bg-card overflow-hidden"
					>
						<div className="flex items-center justify-between p-4 pb-0">
							<div className="space-y-1">
								<Skeleton className="h-5 w-28" />
								<Skeleton className="h-4 w-36" />
							</div>
							<Skeleton className="h-9 w-9 rounded-lg" />
						</div>
						<div className="p-4 space-y-3">
							{Array.from({ length: 5 }).map((_, j) => (
								<div key={j} className="flex items-center gap-3">
									<Skeleton className="h-8 w-8 rounded-full" />
									<div className="flex-1 space-y-1">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-3 w-24" />
									</div>
									<Skeleton className="h-4 w-16" />
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
