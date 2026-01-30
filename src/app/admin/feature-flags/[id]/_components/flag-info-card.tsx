"use client";

import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { toast } from "sonner";
import { toggleGlobalFlag } from "@/shared/actions/feature-flags";

interface FlagInfoCardProps {
	flag: {
		id: string;
		name: string;
		description: string | null;
		enabled: boolean;
		createdAt: Date;
		updatedAt: Date;
	};
}

export function FlagInfoCard({ flag }: FlagInfoCardProps) {
	const [isPending, startTransition] = useTransition();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Flag Information</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<InfoRow label="ID" value={<span className="font-mono text-xs">{flag.id}</span>} />
				<InfoRow
					label="Name"
					value={<code className="font-mono text-sm">{flag.name}</code>}
				/>
				<InfoRow
					label="Description"
					value={flag.description || "No description"}
				/>
				<InfoRow
					label="Status"
					value={
						<div className="flex items-center gap-2">
							<Switch
								checked={flag.enabled}
								disabled={isPending}
								onCheckedChange={(checked) => {
									startTransition(async () => {
										try {
											await toggleGlobalFlag({
												flagId: flag.id,
												enabled: checked,
											});
											toast.success(
												`Flag "${flag.name}" ${checked ? "enabled" : "disabled"}`,
											);
										} catch {
											toast.error("Failed to toggle flag");
										}
									});
								}}
							/>
							<Badge variant={flag.enabled ? "default" : "secondary"}>
								{flag.enabled ? "Enabled" : "Disabled"}
							</Badge>
						</div>
					}
				/>
				<InfoRow
					label="Created"
					value={new Date(flag.createdAt).toLocaleString()}
				/>
				<InfoRow
					label="Updated"
					value={new Date(flag.updatedAt).toLocaleString()}
				/>
			</CardContent>
		</Card>
	);
}

function InfoRow({
	label,
	value,
}: {
	label: string;
	value: React.ReactNode;
}) {
	return (
		<div className="flex items-start justify-between gap-4">
			<span className="text-sm text-muted-foreground shrink-0">{label}</span>
			<span className="text-sm font-medium text-right min-w-0 break-all">
				{value}
			</span>
		</div>
	);
}
