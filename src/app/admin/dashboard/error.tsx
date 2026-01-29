"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { AlertCircle } from "lucide-react";
import { DashboardHeader } from "./_components/dashboard-header";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Dashboard error:", error);
	}, [error]);

	return (
		<div className="space-y-8 pb-6">
			<DashboardHeader />

			<Card className="border-destructive">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-destructive">
						<AlertCircle className="h-5 w-5" />
						Error Loading Dashboard
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-muted-foreground">
						{error.message || "An unexpected error occurred while loading the dashboard."}
					</p>
					<Button onClick={reset} variant="outline">
						Try Again
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
