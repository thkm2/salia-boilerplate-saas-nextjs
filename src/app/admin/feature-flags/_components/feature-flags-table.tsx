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
import { Switch } from "@/shared/components/ui/switch";
import { toast } from "sonner";
import { toggleGlobalFlag } from "@/shared/actions/feature-flags";
import { ChevronRight, Users, Code, Calendar } from "lucide-react";

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
		<div className="rounded-xl border bg-card overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="bg-muted/30 hover:bg-muted/30">
						<TableHead className="min-w-[180px] font-semibold">
							<span className="flex items-center gap-1.5">
								<Code className="h-3.5 w-3.5 text-muted-foreground" />
								Flag Name
							</span>
						</TableHead>
						<TableHead className="font-semibold">Description</TableHead>
						<TableHead className="w-[140px] font-semibold">Status</TableHead>
						<TableHead className="w-[100px] font-semibold">
							<span className="flex items-center gap-1.5">
								<Users className="h-3.5 w-3.5 text-muted-foreground" />
								Users
							</span>
						</TableHead>
						<TableHead className="w-[120px] font-semibold">
							<span className="flex items-center gap-1.5">
								<Calendar className="h-3.5 w-3.5 text-muted-foreground" />
								Created
							</span>
						</TableHead>
						<TableHead className="w-[40px]"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{flags.map((flag, index) => (
						<FlagTableRow key={flag.id} flag={flag} index={index} />
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function FlagTableRow({ flag, index }: { flag: FlagRow; index: number }) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const formatDate = (date: Date) => {
		const d = new Date(date);
		return d.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
		});
	};

	return (
		<TableRow
			className="group cursor-pointer transition-colors hover:bg-muted/50"
			style={{ animationDelay: `${index * 30}ms` }}
			onClick={() => router.push(`/admin/feature-flags/${flag.id}`)}
		>
			{/* Flag Name */}
			<TableCell>
				<div className="flex items-center gap-2">
					<span className={`h-2 w-2 rounded-full transition-colors ${
						flag.enabled
							? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
							: "bg-muted-foreground/30"
					}`} />
					<code className="rounded bg-muted/50 px-2 py-1 font-mono text-sm font-medium">
						{flag.name}
					</code>
				</div>
			</TableCell>

			{/* Description */}
			<TableCell>
				<p className="text-sm text-muted-foreground max-w-[300px] truncate">
					{flag.description || (
						<span className="italic text-muted-foreground/50">No description</span>
					)}
				</p>
			</TableCell>

			{/* Status Toggle */}
			<TableCell onClick={(e) => e.stopPropagation()}>
				<div className="flex items-center gap-3">
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
					<span className={`text-xs font-medium uppercase tracking-wider transition-colors ${
						flag.enabled
							? "text-emerald-600 dark:text-emerald-400"
							: "text-muted-foreground"
					}`}>
						{flag.enabled ? "Enabled" : "Disabled"}
					</span>
				</div>
			</TableCell>

			{/* User Count */}
			<TableCell>
				<div className="flex items-center gap-2">
					{flag.userCount > 0 ? (
						<>
							<span className="font-medium tabular-nums">{flag.userCount}</span>
							<span className="text-xs text-muted-foreground">
								user{flag.userCount !== 1 ? "s" : ""}
							</span>
						</>
					) : (
						<span className="text-sm text-muted-foreground/50">—</span>
					)}
				</div>
			</TableCell>

			{/* Created Date */}
			<TableCell>
				<span className="text-sm text-muted-foreground">
					{formatDate(flag.createdAt)}
				</span>
			</TableCell>

			{/* Arrow */}
			<TableCell>
				<ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
			</TableCell>
		</TableRow>
	);
}
