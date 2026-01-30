"use client";

import { Button } from "@/shared/components/ui/button";
import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	EmptyDescription,
} from "@/shared/components/ui/empty";
import { AlertTriangle } from "lucide-react";

export default function FeatureFlagsError({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="space-y-6 pb-6">
			<div>
				<h1 className="text-3xl font-semibold tracking-tight">
					Feature Flags
				</h1>
			</div>
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<AlertTriangle className="h-5 w-5" />
					</EmptyMedia>
					<EmptyTitle>Something went wrong</EmptyTitle>
					<EmptyDescription>
						Failed to load feature flags. Please try again.
					</EmptyDescription>
				</EmptyHeader>
				<Button variant="outline" size="sm" onClick={reset}>
					Try again
				</Button>
			</Empty>
		</div>
	);
}
