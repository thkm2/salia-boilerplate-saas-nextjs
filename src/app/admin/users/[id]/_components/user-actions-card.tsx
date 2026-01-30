"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import {
	Form,
	FormField,
	FormItem,
	FormControl,
	FormMessage,
} from "@/shared/components/ui/form";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { toast } from "sonner";
import { updateUserRole, grantCredits } from "../../actions";
import {
	assignFlagToUser,
	unassignFlagFromUser,
} from "@/shared/actions/feature-flags";
import { Plus, Minus, ExternalLink } from "lucide-react";
import Link from "next/link";

const grantCreditsSchema = z.object({
	amount: z.number().int("Must be a whole number").refine((v) => v !== 0, "Amount cannot be zero"),
	description: z.string().optional(),
});

type GrantCreditsValues = z.infer<typeof grantCreditsSchema>;

interface FlagEntry {
	id: string;
	name: string;
	description: string | null;
	enabled: boolean;
	assigned: boolean;
}

interface UserActionsCardProps {
	userId: string;
	role: string;
	flags: FlagEntry[];
}

export function UserActionsCard({
	userId,
	role,
	flags,
}: UserActionsCardProps) {
	return (
		<Card className="min-w-0">
			<CardHeader>
				<CardTitle>Actions</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<RoleSection userId={userId} role={role} />
				<Separator />
				<CreditsSection userId={userId} />
				<Separator />
				<FlagsSection userId={userId} flags={flags} />
			</CardContent>
		</Card>
	);
}

function RoleSection({ userId, role }: { userId: string; role: string }) {
	const [isPending, startTransition] = useTransition();

	return (
		<div className="flex items-center justify-between">
			<label className="text-sm font-medium">Role</label>
			<Select
				defaultValue={role}
				disabled={isPending}
				onValueChange={(value) => {
					startTransition(async () => {
						try {
							await updateUserRole({
								userId,
								role: value as "admin" | "user" | "beta",
							});
							toast.success("Role updated");
						} catch {
							toast.error("Failed to update role");
						}
					});
				}}
			>
				<SelectTrigger className="w-[120px]" size="sm">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="admin">Admin</SelectItem>
					<SelectItem value="user">User</SelectItem>
					<SelectItem value="beta">Beta</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}

function CreditsSection({ userId }: { userId: string }) {
	const [isPending, startTransition] = useTransition();

	const creditForm = useForm<GrantCreditsValues>({
		resolver: zodResolver(grantCreditsSchema),
		defaultValues: { amount: undefined, description: "" },
	});

	const onGrantCredits = (values: GrantCreditsValues) => {
		startTransition(async () => {
			try {
				await grantCredits({
					userId,
					amount: values.amount,
					description: values.description || undefined,
				});
				creditForm.reset();
				toast.success(`Granted ${values.amount} credits`);
			} catch {
				toast.error("Failed to grant credits");
			}
		});
	};

	return (
		<div className="space-y-2">
			<label className="text-sm font-medium">Grant Credits</label>
			<Form {...creditForm}>
				<form onSubmit={creditForm.handleSubmit(onGrantCredits)} className="space-y-1">
					<div className="flex flex-wrap gap-2">
						<FormField
							control={creditForm.control}
							name="amount"
							render={({ field }) => (
								<FormItem className="gap-0">
									<FormControl>
										<Input
											type="number"
											placeholder="Amount"
											className="w-24"
											value={field.value ?? ""}
											onChange={(e) => {
												const val = e.target.value;
												field.onChange(val === "" ? undefined : Number(val));
											}}
											onBlur={field.onBlur}
											ref={field.ref}
											name={field.name}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={creditForm.control}
							name="description"
							render={({ field }) => (
								<FormItem className="flex-1 min-w-[120px] gap-0">
									<FormControl>
										<Input
											placeholder="Description (optional)"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<Button size="sm" type="submit" disabled={isPending}>
							Grant
						</Button>
					</div>
					<FormField
						control={creditForm.control}
						name="amount"
						render={() => <FormMessage />}
					/>
				</form>
			</Form>
		</div>
	);
}

function FlagsSection({ userId, flags }: { userId: string; flags: FlagEntry[] }) {
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<label className="text-sm font-medium">Feature Flags</label>
				<Button variant="link" size="sm" className="h-auto p-0" asChild>
					<Link href="/admin/feature-flags">
						Manage Flags
						<ExternalLink className="h-3 w-3 ml-1" />
					</Link>
				</Button>
			</div>
			{flags.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					No flags registered.{" "}
					<Link
						href="/admin/feature-flags"
						className="underline hover:text-foreground"
					>
						Create one
					</Link>
				</p>
			) : (
				<div className="space-y-1.5">
					{flags.map((flag) => (
						<FlagRow key={flag.id} userId={userId} flag={flag} />
					))}
				</div>
			)}
		</div>
	);
}

function FlagRow({ userId, flag }: { userId: string; flag: FlagEntry }) {
	const [isPending, startTransition] = useTransition();

	return (
		<div className="flex items-center justify-between gap-2 py-1">
			<div className="flex items-center gap-2 min-w-0">
				<code className="text-xs font-mono truncate">
					{flag.name}
				</code>
				{!flag.enabled && (
					<Badge variant="outline" className="text-[10px] shrink-0">
						disabled
					</Badge>
				)}
			</div>
			{flag.assigned ? (
				<Button
					variant="ghost"
					size="icon-sm"
					disabled={isPending}
					onClick={() => {
						startTransition(async () => {
							try {
								await unassignFlagFromUser({
									userId,
									flagId: flag.id,
								});
								toast.success(
									`Removed flag "${flag.name}"`,
								);
							} catch {
								toast.error("Failed to remove flag");
							}
						});
					}}
				>
					<Minus className="h-3.5 w-3.5" />
				</Button>
			) : (
				<Button
					variant="ghost"
					size="icon-sm"
					disabled={isPending}
					onClick={() => {
						startTransition(async () => {
							try {
								await assignFlagToUser({
									userId,
									flagId: flag.id,
								});
								toast.success(
									`Assigned flag "${flag.name}"`,
								);
							} catch {
								toast.error("Failed to assign flag");
							}
						});
					}}
				>
					<Plus className="h-3.5 w-3.5" />
				</Button>
			)}
		</div>
	);
}
