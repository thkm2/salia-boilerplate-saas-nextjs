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
import { Trash2Icon } from "lucide-react";
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
    <div className="rounded-lg border border-destructive/50 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-destructive">Delete my account</h2>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data. This action
            cannot be undone.
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
            <Button variant="destructive" size="sm" className="shrink-0">
              <Trash2Icon />
              Delete my account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete account</DialogTitle>
              <DialogDescription>
                This will permanently delete your account, credits, and all
                associated data. This action is irreversible.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="confirmEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Type{" "}
                        <span className="font-mono font-semibold">
                          {userEmail}
                        </span>{" "}
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

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isPending}>
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
    </div>
  );
}
