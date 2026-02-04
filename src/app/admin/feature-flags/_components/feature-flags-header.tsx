"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogDescription,
} from "@/shared/components/ui/dialog";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "@/shared/components/ui/form";
import { toast } from "sonner";
import { Plus, Flag, ToggleRight, Users } from "lucide-react";
import { createFeatureFlag } from "@/shared/actions/feature-flags";
import { PageHeader } from "@/shared/components/ui/page-header";
import { StatCard } from "@/shared/components/ui/stat-card";

const createFlagSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores"),
	description: z.string().optional(),
});

type CreateFlagValues = z.infer<typeof createFlagSchema>;

interface FeatureFlagsHeaderProps {
	total: number;
	stats?: {
		enabledCount?: number;
		totalUsers?: number;
	};
}

export function FeatureFlagsHeader({ total, stats }: FeatureFlagsHeaderProps) {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const form = useForm<CreateFlagValues>({
		resolver: zodResolver(createFlagSchema),
		defaultValues: { name: "", description: "" },
	});

	const onSubmit = (values: CreateFlagValues) => {
		startTransition(async () => {
			try {
				await createFeatureFlag({
					name: values.name,
					description: values.description || undefined,
				});
				form.reset();
				setOpen(false);
				toast.success(`Flag "${values.name}" created`);
			} catch {
				toast.error("Failed to create flag");
			}
		});
	};

	const createFlagButton = (
		<Dialog
			open={open}
			onOpenChange={(value) => {
				setOpen(value);
				if (!value) form.reset();
			}}
		>
			<DialogTrigger asChild>
				<Button className="gap-2 shadow-sm">
					<Plus className="h-4 w-4" />
					Create Flag
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/5 ring-1 ring-foreground/10">
							<Flag className="h-4 w-4" />
						</div>
						Create Feature Flag
					</DialogTitle>
					<DialogDescription>
						Create a new feature flag to control feature access across your application.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="e.g. beta_dashboard"
											className="font-mono"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Lowercase letters, numbers, and underscores only
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Description{" "}
										<span className="text-muted-foreground font-normal">
											(optional)
										</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder="What this flag controls..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className="pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? "Creating..." : "Create Flag"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);

	return (
		<div className="space-y-6">
			<PageHeader
				icon={Flag}
				title="Feature Flags"
				description="Control feature rollouts"
				action={createFlagButton}
			/>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<StatCard
					label="Total Flags"
					value={total}
					icon={Flag}
					accent="default"
				/>
				<StatCard
					label="Enabled"
					value={stats?.enabledCount ?? 0}
					icon={ToggleRight}
					accent="success"
				/>
				<StatCard
					label="Users with Flags"
					value={stats?.totalUsers ?? 0}
					icon={Users}
					accent="info"
				/>
			</div>
		</div>
	);
}
