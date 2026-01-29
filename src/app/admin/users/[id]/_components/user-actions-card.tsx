"use client";

import { useState, useTransition } from "react";
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
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { toast } from "sonner";
import {
	updateUserRole,
	grantCredits,
	toggleFeatureFlag,
} from "../../actions";
import { parseFeatureFlags } from "@/lib/auth/types";
import { X, Plus } from "lucide-react";

interface UserActionsCardProps {
	userId: string;
	role: string;
	featureFlags: string;
}

export function UserActionsCard({
	userId,
	role,
	featureFlags,
}: UserActionsCardProps) {
	const [isPending, startTransition] = useTransition();
	const [creditAmount, setCreditAmount] = useState("");
	const [creditDescription, setCreditDescription] = useState("");
	const [newFlag, setNewFlag] = useState("");

	const flags = parseFeatureFlags(featureFlags);
	const flagKeys = Object.keys(flags).filter((k) => flags[k]);

	return (
		<Card className="min-w-0">
			<CardHeader>
				<CardTitle>Actions</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
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

				<Separator />

				<div className="space-y-2">
					<label className="text-sm font-medium">Grant Credits</label>
					<div className="flex flex-wrap gap-2">
						<Input
							type="number"
							placeholder="Amount"
							value={creditAmount}
							onChange={(e) => setCreditAmount(e.target.value)}
							className="w-24"
						/>
						<Input
							placeholder="Description (optional)"
							value={creditDescription}
							onChange={(e) => setCreditDescription(e.target.value)}
							className="flex-1 min-w-[120px]"
						/>
						<Button
							size="sm"
							disabled={!creditAmount || isPending}
							onClick={() => {
								const amount = Number(creditAmount);
								if (!amount) return;
								startTransition(async () => {
									try {
										await grantCredits({
											userId,
											amount,
											description: creditDescription || undefined,
										});
										setCreditAmount("");
										setCreditDescription("");
										toast.success(`Granted ${amount} credits`);
									} catch {
										toast.error("Failed to grant credits");
									}
								});
							}}
						>
							Grant
						</Button>
					</div>
				</div>

				<Separator />

				<div className="space-y-2">
					<label className="text-sm font-medium">Feature Flags</label>
					{flagKeys.length > 0 && (
						<div className="flex flex-wrap gap-1.5">
							{flagKeys.map((flag) => (
								<Badge key={flag} variant="secondary" className="gap-1">
									{flag}
									<button
										type="button"
										disabled={isPending}
										onClick={() => {
											startTransition(async () => {
												try {
													await toggleFeatureFlag({
														userId,
														flag,
														enabled: false,
													});
													toast.success(`Removed flag "${flag}"`);
												} catch {
													toast.error("Failed to remove flag");
												}
											});
										}}
										className="ml-0.5 hover:text-destructive"
									>
										<X className="h-3 w-3" />
									</button>
								</Badge>
							))}
						</div>
					)}
					<div className="flex gap-2">
						<Input
							placeholder="New flag name"
							value={newFlag}
							onChange={(e) => setNewFlag(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && newFlag.trim()) {
									e.preventDefault();
									startTransition(async () => {
										try {
											await toggleFeatureFlag({
												userId,
												flag: newFlag.trim(),
												enabled: true,
											});
											setNewFlag("");
											toast.success(`Added flag "${newFlag.trim()}"`);
										} catch {
											toast.error("Failed to add flag");
										}
									});
								}
							}}
						/>
						<Button
							size="sm"
							variant="outline"
							disabled={!newFlag.trim() || isPending}
							onClick={() => {
								startTransition(async () => {
									try {
										await toggleFeatureFlag({
											userId,
											flag: newFlag.trim(),
											enabled: true,
										});
										setNewFlag("");
										toast.success(`Added flag "${newFlag.trim()}"`);
									} catch {
										toast.error("Failed to add flag");
									}
								});
							}}
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
