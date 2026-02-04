import { Skeleton } from "@/shared/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<Skeleton className="h-10 w-10 rounded-lg" />
				<div className="space-y-1">
					<Skeleton className="h-7 w-24" />
					<Skeleton className="h-4 w-48" />
				</div>
			</div>

			{/* Profile Card */}
			<div className="rounded-xl border bg-card overflow-hidden">
				<div className="p-6 pb-4">
					<div className="flex items-center gap-4">
						<Skeleton className="h-16 w-16 rounded-full" />
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-32" />
								<Skeleton className="h-5 w-14 rounded-full" />
							</div>
							<Skeleton className="h-4 w-48" />
						</div>
					</div>
				</div>

				<div className="px-6 pb-6">
					<div className="border-t pt-4 space-y-0">
						{[1, 2, 3, 4, 5].map((i) => (
							<div
								key={i}
								className="flex items-center justify-between py-2.5"
							>
								<div className="flex items-center gap-2.5">
									<Skeleton className="h-6 w-6 rounded-md" />
									<Skeleton className="h-4 w-20" />
								</div>
								<Skeleton className="h-4 w-24" />
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Delete Account Card */}
			<div className="rounded-lg border border-destructive/50 p-6">
				<div className="flex items-center justify-between gap-4">
					<div className="space-y-2">
						<Skeleton className="h-5 w-36" />
						<Skeleton className="h-4 w-72" />
					</div>
					<Skeleton className="h-9 w-36 rounded-md" />
				</div>
			</div>
		</div>
	);
}
