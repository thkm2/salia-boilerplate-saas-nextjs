"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/shared/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Trash2Icon, AlertTriangle } from "lucide-react";
import { deleteAccount } from "../actions";

function createSchema(email: string) {
	return z.object({
		confirmEmail: z.string().refine((val) => val === email, {
			message: "Email does not match.",
		}),
	});
}

type FormValues = z.infer<ReturnType<typeof createSchema>>;

export function DeleteAccountCard({ userEmail }: { userEmail: string }) {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const form = useForm<FormValues>({
		resolver: zodResolver(createSchema(userEmail)),
		defaultValues: { confirmEmail: "" },
	});

	function onSubmit() {
		startTransition(async () => {
			const result = await deleteAccount();
			if ("success" in result) {
				window.location.href = "/";
			}
		});
	}

	return (
		<Card className="border-destructive/30 bg-destructive/[0.02]">
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base text-destructive">
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10">
						<AlertTriangle className="h-3.5 w-3.5 text-destructive" />
					</div>
					Danger Zone
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between gap-4">
					<div className="space-y-1">
						<p className="text-sm font-medium">Delete my account</p>
						<p className="text-sm text-muted-foreground">
							Permanently delete your account and all associated data. This
							action cannot be undone.
						</p>
					</div>

					<Dialog
						open={open}
						onOpenChange={(v) => {
							setOpen(v);
							if (!v) form.reset();
						}}
					>
						<DialogTrigger asChild>
							<Button variant="destructive" size="sm" className="shrink-0 shadow-sm">
								<Trash2Icon className="h-4 w-4" />
								Delete account
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle className="flex items-center gap-2">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
										<AlertTriangle className="h-4 w-4 text-destructive" />
									</div>
									Delete account
								</DialogTitle>
								<DialogDescription>
									This will permanently delete your account, credits, and all
									associated data. This action is irreversible.
								</DialogDescription>
							</DialogHeader>

							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-4 py-2"
								>
									<FormField
										control={form.control}
										name="confirmEmail"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Type{" "}
													<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
														{userEmail}
													</code>{" "}
													to confirm
												</FormLabel>
												<FormControl>
													<Input
														placeholder={userEmail}
														autoComplete="off"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<DialogFooter className="pt-4">
										<DialogClose asChild>
											<Button
												type="button"
												variant="outline"
												disabled={isPending}
											>
												Cancel
											</Button>
										</DialogClose>
										<Button
											type="submit"
											variant="destructive"
											disabled={isPending}
										>
											{isPending ? "Deleting..." : "Delete my account"}
										</Button>
									</DialogFooter>
								</form>
							</Form>
						</DialogContent>
					</Dialog>
				</div>
			</CardContent>
		</Card>
	);
}
