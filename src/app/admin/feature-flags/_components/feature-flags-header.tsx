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
import { Plus } from "lucide-react";
import { createFeatureFlag } from "@/shared/actions/feature-flags";

const createFlagSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores"),
	description: z.string().optional(),
});

type CreateFlagValues = z.infer<typeof createFlagSchema>;

export function FeatureFlagsHeader({ total }: { total: number }) {
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

	return (
		<div className="flex items-center justify-between">
			<div>
				<h1 className="text-3xl font-semibold tracking-tight">
					Feature Flags
				</h1>
				<p className="text-muted-foreground mt-1">
					{total} flag{total !== 1 ? "s" : ""} registered
				</p>
			</div>
			<Dialog
				open={open}
				onOpenChange={(value) => {
					setOpen(value);
					if (!value) form.reset();
				}}
			>
				<DialogTrigger asChild>
					<Button size="sm">
						<Plus className="h-4 w-4 mr-1.5" />
						Create Flag
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create Feature Flag</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="e.g. beta_dashboard" {...field} />
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
							<DialogFooter>
								<Button type="submit" disabled={isPending}>
									Create
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
