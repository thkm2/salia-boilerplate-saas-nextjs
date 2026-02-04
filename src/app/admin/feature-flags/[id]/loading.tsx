import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";

export default function FlagDetailLoading() {
	return (
		<div className="space-y-6 pb-6">
			{/* Header skeleton */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Skeleton className="h-8 w-8 rounded-md" />
					<Skeleton className="h-11 w-11 rounded-xl" />
					<div>
						<div className="flex items-center gap-2.5">
							<Skeleton className="h-7 w-48" />
							<Skeleton className="h-5 w-16 rounded-full" />
						</div>
						<Skeleton className="h-4 w-24 mt-1" />
					</div>
				</div>
				<Skeleton className="h-9 w-24" />
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Info Card skeleton */}
				<Card className="gap-4">
					<CardHeader>
						<div className="flex items-center gap-2">
							<Skeleton className="h-7 w-7 rounded-lg" />
							<Skeleton className="h-5 w-32" />
						</div>
					</CardHeader>
					<CardContent className="space-y-0">
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="flex items-center justify-between py-2.5">
								<div className="flex items-center gap-2.5">
									<Skeleton className="h-6 w-6 rounded-md" />
									<Skeleton className="h-4 w-20" />
								</div>
								<Skeleton className="h-4 w-32" />
							</div>
						))}
						<div className="!mt-4 pt-4 border-t border-dashed space-y-0">
							{Array.from({ length: 2 }).map((_, i) => (
								<div key={i} className="flex items-center justify-between py-2.5">
									<div className="flex items-center gap-2.5">
										<Skeleton className="h-6 w-6 rounded-md" />
										<Skeleton className="h-4 w-20" />
									</div>
									<div className="flex flex-col items-end gap-1">
										<Skeleton className="h-4 w-16" />
										<Skeleton className="h-3 w-24" />
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Users Card skeleton */}
				<Card className="gap-4">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Skeleton className="h-7 w-7 rounded-lg" />
								<Skeleton className="h-5 w-32" />
							</div>
							<Skeleton className="h-5 w-8 rounded-full" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-1">
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="flex items-center justify-between gap-3 py-2.5 px-3 -mx-3">
									<div className="flex items-center gap-3">
										<Skeleton className="h-8 w-8 rounded-full" />
										<div className="space-y-1">
											<Skeleton className="h-4 w-28" />
											<Skeleton className="h-3 w-36" />
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Skeleton className="h-3 w-12 hidden sm:block" />
										<Skeleton className="h-7 w-7 rounded-md" />
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
