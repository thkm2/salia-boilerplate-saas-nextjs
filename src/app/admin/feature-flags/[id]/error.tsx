"use client";

import { Button } from "@/shared/components/ui/button";
import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	EmptyDescription,
} from "@/shared/components/ui/empty";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FlagDetailError({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="space-y-6 pb-6">
			<Button variant="ghost" size="icon-sm" asChild>
				<Link href="/admin/feature-flags">
					<ArrowLeft className="h-4 w-4" />
				</Link>
			</Button>
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<AlertTriangle className="h-5 w-5" />
					</EmptyMedia>
					<EmptyTitle>Something went wrong</EmptyTitle>
					<EmptyDescription>
						Failed to load feature flag details. Please try again.
					</EmptyDescription>
				</EmptyHeader>
				<Button variant="outline" size="sm" onClick={reset}>
					Try again
				</Button>
			</Empty>
		</div>
	);
}
