import { Skeleton } from "@/shared/components/ui/skeleton";

export default function UsersLoading() {
	return (
		<div className="space-y-6 pb-8">
			{/* Header */}
			<div className="space-y-6">
				<div className="flex items-center gap-3">
					<Skeleton className="h-10 w-10 rounded-lg" />
					<div className="space-y-1">
						<Skeleton className="h-7 w-24" />
						<Skeleton className="h-4 w-40" />
					</div>
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
									<Skeleton className="h-7 w-16" />
								</div>
								<Skeleton className="h-10 w-10 rounded-lg" />
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Filters */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<Skeleton className="h-9 flex-1" />
				<Skeleton className="h-9 w-[130px]" />
				<Skeleton className="h-9 w-[130px]" />
			</div>

			{/* Table */}
			<div className="rounded-xl border bg-card overflow-hidden">
				<div className="p-4 space-y-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="flex items-center gap-4">
							<Skeleton className="h-8 w-8 rounded-full" />
							<div className="flex-1 space-y-1">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-3 w-40" />
							</div>
							<Skeleton className="h-5 w-14 rounded-full" />
							<Skeleton className="h-5 w-12 rounded-full" />
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-4 w-20" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
