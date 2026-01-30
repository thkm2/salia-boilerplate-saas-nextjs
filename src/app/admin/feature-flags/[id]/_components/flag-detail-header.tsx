"use client";

import { useState, useTransition } from "react";
import { Button } from "@/shared/components/ui/button";
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
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteFeatureFlag } from "@/shared/actions/feature-flags";

interface FlagDetailHeaderProps {
	flagId: string;
	name: string;
}

export function FlagDetailHeader({ flagId, name }: FlagDetailHeaderProps) {
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
				<div>
					<h1 className="text-2xl font-semibold tracking-tight font-mono">
						{name}
					</h1>
				</div>
			</div>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="destructive" size="sm">
						<Trash2 className="h-4 w-4 mr-1.5" />
						Delete
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Feature Flag</DialogTitle>
						<DialogDescription>
							This will permanently delete the flag{" "}
							<code className="font-mono font-semibold">{name}</code>{" "}
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
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
