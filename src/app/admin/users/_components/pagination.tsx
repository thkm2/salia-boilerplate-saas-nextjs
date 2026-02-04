"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export function Pagination({
	page,
	totalPages,
	total,
}: {
	page: number;
	totalPages: number;
	total: number;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const goToPage = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		if (newPage > 1) {
			params.set("page", String(newPage));
		} else {
			params.delete("page");
		}
		startTransition(() => {
			router.push(`/admin/users?${params.toString()}`);
		});
	};

	if (totalPages <= 1) return null;

	// Calculate visible page numbers
	const getVisiblePages = () => {
		const delta = 1;
		const pages: (number | "ellipsis")[] = [];

		for (let i = 1; i <= totalPages; i++) {
			if (
				i === 1 ||
				i === totalPages ||
				(i >= page - delta && i <= page + delta)
			) {
				pages.push(i);
			} else if (pages[pages.length - 1] !== "ellipsis") {
				pages.push("ellipsis");
			}
		}

		return pages;
	};

	const visiblePages = getVisiblePages();

	return (
		<div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
			{/* Info */}
			<div className="flex items-center gap-2">
				<span className="text-sm text-muted-foreground">
					Showing page
				</span>
				<span className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded-md bg-muted px-2 text-sm font-medium tabular-nums">
					{page}
				</span>
				<span className="text-sm text-muted-foreground">
					of {totalPages}
				</span>
				<span className="mx-2 h-4 w-px bg-border" />
				<span className="text-sm text-muted-foreground">
					{total.toLocaleString("en-US")} total
				</span>
			</div>

			{/* Controls */}
			<div className="flex items-center gap-1">
				{/* First page */}
				<Button
					variant="ghost"
					size="icon-sm"
					disabled={page <= 1 || isPending}
					onClick={() => goToPage(1)}
					className="text-muted-foreground hover:text-foreground"
				>
					<ChevronsLeft className="h-4 w-4" />
				</Button>

				{/* Previous */}
				<Button
					variant="ghost"
					size="icon-sm"
					disabled={page <= 1 || isPending}
					onClick={() => goToPage(page - 1)}
					className="text-muted-foreground hover:text-foreground"
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				{/* Page numbers */}
				<div className="flex items-center gap-1 mx-1">
					{visiblePages.map((p, i) =>
						p === "ellipsis" ? (
							<span
								key={`ellipsis-${i}`}
								className="px-1 text-muted-foreground"
							>
								...
							</span>
						) : (
							<Button
								key={p}
								variant={p === page ? "default" : "ghost"}
								size="icon-sm"
								disabled={isPending}
								onClick={() => goToPage(p)}
								className={
									p === page
										? ""
										: "text-muted-foreground hover:text-foreground"
								}
							>
								{p}
							</Button>
						)
					)}
				</div>

				{/* Next */}
				<Button
					variant="ghost"
					size="icon-sm"
					disabled={page >= totalPages || isPending}
					onClick={() => goToPage(page + 1)}
					className="text-muted-foreground hover:text-foreground"
				>
					<ChevronRight className="h-4 w-4" />
				</Button>

				{/* Last page */}
				<Button
					variant="ghost"
					size="icon-sm"
					disabled={page >= totalPages || isPending}
					onClick={() => goToPage(totalPages)}
					className="text-muted-foreground hover:text-foreground"
				>
					<ChevronsRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
