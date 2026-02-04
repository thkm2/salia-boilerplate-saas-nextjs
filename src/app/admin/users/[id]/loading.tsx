import { Skeleton } from "@/shared/components/ui/skeleton";

export default function UserDetailLoading() {
	return (
		<div className="space-y-6 pb-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Skeleton className="h-8 w-8 rounded-md" />
					<Skeleton className="h-11 w-11 rounded-full" />
					<div className="space-y-1">
						<div className="flex items-center gap-2.5">
							<Skeleton className="h-7 w-40" />
							<Skeleton className="h-5 w-14 rounded-full" />
						</div>
						<Skeleton className="h-4 w-48" />
					</div>
				</div>
			</div>

			{/* Cards Grid */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Info Card */}
				<div className="rounded-xl border bg-card overflow-hidden">
					<div className="p-4 pb-2">
						<div className="flex items-center gap-2">
							<Skeleton className="h-7 w-7 rounded-lg" />
							<Skeleton className="h-5 w-32" />
						</div>
					</div>
					<div className="p-4 pt-0 space-y-0">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="flex items-center justify-between py-2.5">
								<div className="flex items-center gap-2.5">
									<Skeleton className="h-6 w-6 rounded-md" />
									<Skeleton className="h-4 w-20" />
								</div>
								<Skeleton className="h-4 w-32" />
							</div>
						))}
					</div>
				</div>

				{/* Actions Card */}
				<div className="rounded-xl border bg-card overflow-hidden">
					<div className="p-4 pb-2">
						<div className="flex items-center gap-2">
							<Skeleton className="h-7 w-7 rounded-lg" />
							<Skeleton className="h-5 w-24" />
						</div>
					</div>
					<div className="p-4 pt-0 space-y-3">
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} className="h-9 w-full rounded-lg" />
						))}
					</div>
				</div>
			</div>

			{/* Feature Flags Card */}
			<div className="rounded-xl border bg-card overflow-hidden">
				<div className="p-4 pb-2">
					<div className="flex items-center gap-2">
						<Skeleton className="h-7 w-7 rounded-lg" />
						<Skeleton className="h-5 w-28" />
					</div>
				</div>
				<div className="p-4 pt-0 space-y-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="flex justify-between items-center">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-5 w-10" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
