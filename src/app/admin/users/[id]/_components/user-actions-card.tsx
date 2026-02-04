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
import { toast } from "sonner";
import { updateUserRole, grantCredits } from "../../actions";
import {
	assignFlagToUser,
	unassignFlagFromUser,
} from "@/shared/actions/feature-flags";
import {
	Settings,
	Shield,
	Coins,
	Flag,
	Plus,
	Minus,
	ExternalLink,
	Loader2,
	ChevronRight,
} from "lucide-react";
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
		<Card className="min-w-0 overflow-hidden gap-4">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
						<Settings className="h-3.5 w-3.5 text-primary" />
					</div>
					Actions
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-5">
				<RoleSection userId={userId} role={role} />
				<CreditsSection userId={userId} />
				<FlagsSection userId={userId} flags={flags} />
			</CardContent>
		</Card>
	);
}

function SectionHeader({
	icon,
	title,
	action,
}: {
	icon: React.ReactNode;
	title: string;
	action?: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between mb-3">
			<div className="flex items-center gap-2">
				<span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted/50 text-muted-foreground">
					{icon}
				</span>
				<span className="text-sm font-medium">{title}</span>
			</div>
			{action}
		</div>
	);
}

function RoleSection({ userId, role }: { userId: string; role: string }) {
	const [isPending, startTransition] = useTransition();

	const roleOptions = [
		{ value: "admin", label: "Admin", description: "Full system access" },
		{ value: "beta", label: "Beta", description: "Early feature access" },
		{ value: "user", label: "User", description: "Standard access" },
	];

	return (
		<div className="rounded-lg border bg-muted/20 p-4">
			<SectionHeader icon={<Shield className="h-3.5 w-3.5" />} title="User Role" />
			<div className="flex items-center gap-3">
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
								toast.success("Role updated successfully");
							} catch {
								toast.error("Failed to update role");
							}
						});
					}}
				>
					<SelectTrigger className="flex-1 bg-background" disabled={isPending}>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{roleOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								<div className="flex items-center gap-2">
									<span className="font-medium">{option.label}</span>
									<span className="text-xs text-muted-foreground">
										— {option.description}
									</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
			</div>
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
				const action = values.amount > 0 ? "Added" : "Removed";
				toast.success(`${action} ${Math.abs(values.amount)} credits`);
			} catch {
				toast.error("Failed to update credits");
			}
		});
	};

	const quickAmounts = [10, 50, 100, 500];

	return (
		<div className="rounded-lg border bg-muted/20 p-4">
			<SectionHeader
				icon={<Coins className="h-3.5 w-3.5" />}
				title="Grant Credits"
			/>

			{/* Quick Amount Buttons */}
			<div className="flex flex-wrap gap-1.5 mb-3">
				{quickAmounts.map((amount) => (
					<Button
						key={amount}
						type="button"
						variant="outline"
						size="sm"
						className="h-7 px-2.5 text-xs font-medium bg-background hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/30 transition-colors"
						onClick={() => creditForm.setValue("amount", amount)}
						disabled={isPending}
					>
						+{amount}
					</Button>
				))}
			</div>

			<Form {...creditForm}>
				<form onSubmit={creditForm.handleSubmit(onGrantCredits)} className="space-y-2">
					<div className="flex gap-2">
						<FormField
							control={creditForm.control}
							name="amount"
							render={({ field }) => (
								<FormItem className="gap-0">
									<FormControl>
										<Input
											type="number"
											placeholder="±Amount"
											className="w-24 bg-background tabular-nums"
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
								<FormItem className="flex-1 min-w-0 gap-0">
									<FormControl>
										<Input
											placeholder="Reason (optional)"
											className="bg-background"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<div className="flex items-center justify-between gap-2">
						<FormField
							control={creditForm.control}
							name="amount"
							render={() => <FormMessage className="text-xs" />}
						/>
						<Button
							size="sm"
							type="submit"
							disabled={isPending}
							className="ml-auto"
						>
							{isPending ? (
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
							) : (
								<>
									<Coins className="h-3.5 w-3.5 mr-1.5" />
									Grant
								</>
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}

function FlagsSection({ userId, flags }: { userId: string; flags: FlagEntry[] }) {
	const assignedFlags = flags.filter((f) => f.assigned);
	const availableFlags = flags.filter((f) => !f.assigned);

	return (
		<div className="rounded-lg border bg-muted/20 p-4">
			<SectionHeader
				icon={<Flag className="h-3.5 w-3.5" />}
				title="Feature Flags"
				action={
					<Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground" asChild>
						<Link href="/admin/feature-flags" className="flex items-center gap-1">
							Manage
							<ExternalLink className="h-3 w-3" />
						</Link>
					</Button>
				}
			/>

			{flags.length === 0 ? (
				<div className="text-center py-6">
					<Flag className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
					<p className="text-sm text-muted-foreground mb-2">
						No feature flags defined
					</p>
					<Button variant="outline" size="sm" asChild>
						<Link href="/admin/feature-flags">
							Create your first flag
							<ChevronRight className="h-3.5 w-3.5 ml-1" />
						</Link>
					</Button>
				</div>
			) : (
				<div className="space-y-3">
					{/* Assigned Flags */}
					{assignedFlags.length > 0 && (
						<div>
							<p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
								Active ({assignedFlags.length})
							</p>
							<div className="space-y-1">
								{assignedFlags.map((flag) => (
									<FlagRow key={flag.id} userId={userId} flag={flag} />
								))}
							</div>
						</div>
					)}

					{/* Available Flags */}
					{availableFlags.length > 0 && (
						<div>
							<p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
								Available ({availableFlags.length})
							</p>
							<div className="space-y-1">
								{availableFlags.map((flag) => (
									<FlagRow key={flag.id} userId={userId} flag={flag} />
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

function FlagRow({ userId, flag }: { userId: string; flag: FlagEntry }) {
	const [isPending, startTransition] = useTransition();

	const handleToggle = () => {
		startTransition(async () => {
			try {
				if (flag.assigned) {
					await unassignFlagFromUser({ userId, flagId: flag.id });
					toast.success(`Removed "${flag.name}"`);
				} else {
					await assignFlagToUser({ userId, flagId: flag.id });
					toast.success(`Assigned "${flag.name}"`);
				}
			} catch {
				toast.error(`Failed to ${flag.assigned ? "remove" : "assign"} flag`);
			}
		});
	};

	return (
		<div
			className={`flex items-center justify-between gap-3 py-2 px-3 rounded-md transition-colors ${
				flag.assigned
					? "bg-emerald-500/5 border border-emerald-500/20"
					: "bg-background border border-transparent hover:border-border"
			}`}
		>
			<div className="flex items-center gap-2 min-w-0">
				<div
					className={`h-2 w-2 rounded-full shrink-0 ${
						flag.assigned
							? "bg-emerald-500"
							: flag.enabled
								? "bg-muted-foreground/30"
								: "bg-muted-foreground/10"
					}`}
				/>
				<code className="text-xs font-mono truncate">{flag.name}</code>
				{!flag.enabled && (
					<Badge variant="outline" className="text-[9px] h-4 px-1 shrink-0 text-muted-foreground">
						disabled
					</Badge>
				)}
			</div>
			<Button
				variant={flag.assigned ? "ghost" : "outline"}
				size="icon-sm"
				disabled={isPending}
				onClick={handleToggle}
				className={`shrink-0 ${
					flag.assigned
						? "hover:bg-red-500/10 hover:text-red-500"
						: "hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30"
				}`}
			>
				{isPending ? (
					<Loader2 className="h-3 w-3 animate-spin" />
				) : flag.assigned ? (
					<Minus className="h-3.5 w-3.5" />
				) : (
					<Plus className="h-3.5 w-3.5" />
				)}
			</Button>
		</div>
	);
}
