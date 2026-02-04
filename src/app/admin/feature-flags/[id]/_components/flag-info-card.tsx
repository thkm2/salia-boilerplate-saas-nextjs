"use client";

import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { toast } from "sonner";
import { toggleGlobalFlag } from "@/shared/actions/feature-flags";
import {
	Info,
	Hash,
	Type,
	FileText,
	Power,
	CalendarPlus,
	CalendarClock,
} from "lucide-react";
import { CopyButton } from "@/shared/components/copy-button";
import { formatDateWithTimestamp } from "@/shared/utils/format-date";

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
		<Card className="min-w-0 overflow-hidden gap-4">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
						<Info className="h-3.5 w-3.5 text-primary" />
					</div>
					Flag Information
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-0">
				{/* ID Row */}
				<InfoRow icon={<Hash className="h-3.5 w-3.5" />} label="Flag ID">
					<div className="flex items-center gap-1.5">
						<code className="text-xs font-mono text-muted-foreground truncate max-w-[180px]">
							{flag.id}
						</code>
						<CopyButton value={flag.id} />
					</div>
				</InfoRow>

				{/* Name Row */}
				<InfoRow icon={<Type className="h-3.5 w-3.5" />} label="Name">
					<div className="flex items-center gap-1.5">
						<code className="text-sm font-mono font-medium">{flag.name}</code>
						<CopyButton value={flag.name} />
					</div>
				</InfoRow>

				{/* Description Row */}
				<InfoRow
					icon={<FileText className="h-3.5 w-3.5" />}
					label="Description"
					alignTop={!!flag.description && flag.description.length > 40}
				>
					{flag.description ? (
						<span className="text-sm">{flag.description}</span>
					) : (
						<span className="text-sm text-muted-foreground italic">No description</span>
					)}
				</InfoRow>

				{/* Status Row */}
				<InfoRow icon={<Power className="h-3.5 w-3.5" />} label="Global Status">
					<div className="flex items-center gap-2.5">
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
						<Badge
							variant={flag.enabled ? "default" : "secondary"}
							className={`${
								flag.enabled
									? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
									: "bg-muted/50 text-muted-foreground"
							} font-medium transition-colors`}
						>
							{flag.enabled ? "Enabled" : "Disabled"}
						</Badge>
					</div>
				</InfoRow>

				{/* Timestamps */}
				<div className="!mt-4 pt-4 border-t border-dashed space-y-0">
					<InfoRow icon={<CalendarPlus className="h-3.5 w-3.5" />} label="Created">
						<TimeDisplay date={flag.createdAt} />
					</InfoRow>

					<InfoRow icon={<CalendarClock className="h-3.5 w-3.5" />} label="Last Updated">
						<TimeDisplay date={flag.updatedAt} />
					</InfoRow>
				</div>
			</CardContent>
		</Card>
	);
}

function InfoRow({
	icon,
	label,
	children,
	alignTop = false,
}: {
	icon: React.ReactNode;
	label: string;
	children: React.ReactNode;
	alignTop?: boolean;
}) {
	return (
		<div
			className={`flex ${alignTop ? "items-start" : "items-center"} justify-between gap-4 py-2.5 group`}
		>
			<div className="flex items-center gap-2.5 text-muted-foreground shrink-0">
				<span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted/50 text-muted-foreground group-hover:bg-muted transition-colors">
					{icon}
				</span>
				<span className="text-sm">{label}</span>
			</div>
			<div className="min-w-0 text-right">{children}</div>
		</div>
	);
}

function TimeDisplay({ date }: { date: Date }) {
	const formatted = formatDateWithTimestamp(date);

	if (!formatted) {
		return <span className="text-sm text-muted-foreground italic">Never</span>;
	}

	return (
		<div className="flex flex-col items-end">
			<span className="text-sm font-medium">{formatted.relative}</span>
			<span className="text-[11px] text-muted-foreground tabular-nums">
				{formatted.timestamp}
			</span>
		</div>
	);
}
