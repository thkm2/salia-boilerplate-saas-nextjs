"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { toast } from "sonner";
import { toggleGlobalFlag } from "@/shared/actions/feature-flags";

interface FlagRow {
	id: string;
	name: string;
	description: string | null;
	enabled: boolean;
	createdAt: Date;
	userCount: number;
}

export function FeatureFlagsTable({ flags }: { flags: FlagRow[] }) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="min-w-[160px]">Name</TableHead>
						<TableHead>Description</TableHead>
						<TableHead className="w-[100px]">Status</TableHead>
						<TableHead className="w-[80px] text-right pr-6">Users</TableHead>
						<TableHead className="w-[120px]">Created</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{flags.map((flag) => (
						<FlagTableRow key={flag.id} flag={flag} />
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function FlagTableRow({ flag }: { flag: FlagRow }) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	return (
		<TableRow
			className="cursor-pointer"
			onClick={() => router.push(`/admin/feature-flags/${flag.id}`)}
		>
			<TableCell className="font-mono text-sm font-medium">
				{flag.name}
			</TableCell>
			<TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
				{flag.description || "—"}
			</TableCell>
			<TableCell onClick={(e) => e.stopPropagation()}>
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
					<Badge
						variant={flag.enabled ? "default" : "secondary"}
					>
						{flag.enabled ? "on" : "off"}
					</Badge>
				</div>
			</TableCell>
			<TableCell className="text-right font-medium pr-6">
				{flag.userCount}
			</TableCell>
			<TableCell className="text-sm text-muted-foreground">
				{new Date(flag.createdAt).toLocaleDateString("en-US")}
			</TableCell>
		</TableRow>
	);
}
