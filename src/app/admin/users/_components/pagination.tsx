"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
	const [, startTransition] = useTransition();

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

	return (
		<div className="flex items-center justify-between">
			<p className="text-sm text-muted-foreground">
				Page {page} of {totalPages} ({total.toLocaleString()} users)
			</p>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="icon-sm"
					disabled={page <= 1}
					onClick={() => goToPage(page - 1)}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="icon-sm"
					disabled={page >= totalPages}
					onClick={() => goToPage(page + 1)}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
