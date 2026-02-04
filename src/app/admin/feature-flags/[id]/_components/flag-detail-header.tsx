"use client";

import { useState, useTransition } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogDescription,
} from "@/shared/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Flag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteFeatureFlag } from "@/shared/actions/feature-flags";

interface FlagDetailHeaderProps {
	flagId: string;
	name: string;
	enabled: boolean;
}

export function FlagDetailHeader({ flagId, name, enabled }: FlagDetailHeaderProps) {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon-sm" asChild>
					<Link href="/admin/feature-flags">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 ring-1 ring-violet-500/20">
					<Flag className="h-5 w-5 text-violet-500" />
				</div>
				<div>
					<div className="flex items-center gap-2.5">
						<h1 className="text-2xl font-semibold tracking-tight font-mono">
							{name}
						</h1>
						<Badge
							variant={enabled ? "default" : "secondary"}
							className={`${
								enabled
									? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
									: "bg-muted/50 text-muted-foreground"
							}`}
						>
							{enabled ? "Enabled" : "Disabled"}
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground">Feature Flag</p>
				</div>
			</div>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
						<Trash2 className="h-4 w-4 mr-1.5" />
						Delete
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Feature Flag</DialogTitle>
						<DialogDescription>
							This will permanently delete the flag{" "}
							<code className="font-mono font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded">{name}</code>{" "}
							and remove it from all assigned users. This action cannot be
							undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							disabled={isPending}
							onClick={() => {
								startTransition(async () => {
									try {
										await deleteFeatureFlag({ flagId });
										toast.success(`Flag "${name}" deleted`);
										router.push("/admin/feature-flags");
									} catch {
										toast.error("Failed to delete flag");
									}
								});
							}}
						>
							{isPending ? (
								<Loader2 className="h-4 w-4 animate-spin mr-1.5" />
							) : (
								<Trash2 className="h-4 w-4 mr-1.5" />
							)}
							Delete Flag
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
