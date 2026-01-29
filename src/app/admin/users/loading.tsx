import { Skeleton } from "@/shared/components/ui/skeleton";

export default function UsersLoading() {
	return (
		<div className="space-y-6 pb-6">
			<div>
				<Skeleton className="h-9 w-32" />
				<Skeleton className="h-5 w-48 mt-2" />
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<Skeleton className="h-9 flex-1" />
				<Skeleton className="h-9 w-[130px]" />
				<Skeleton className="h-9 w-[130px]" />
			</div>

			<div className="rounded-md border">
				<div className="p-4 space-y-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="flex items-center gap-4">
							<Skeleton className="h-6 w-6 rounded-full" />
							<Skeleton className="h-4 flex-1" />
							<Skeleton className="h-5 w-16" />
							<Skeleton className="h-5 w-16" />
							<Skeleton className="h-4 w-12" />
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-20" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
