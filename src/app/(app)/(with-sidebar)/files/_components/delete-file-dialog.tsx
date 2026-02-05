"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { deleteFile } from "@/shared/actions/files";

interface DeleteFileDialogProps {
  fileId: string;
  filename: string;
  onDeleted: () => void;
  // Controlled mode props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // Uncontrolled mode - show trigger button
  showTrigger?: boolean;
}

export function DeleteFileDialog({
  fileId,
  filename,
  onDeleted,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  showTrigger = false,
}: DeleteFileDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use controlled or uncontrolled mode
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteFile(fileId);
    setIsDeleting(false);

    if (result.success) {
      toast.success("File deleted");
      setOpen(false);
      onDeleted();
    } else {
      toast.error(result.error);
    }
  }

  const dialogContent = (
    <DialogContent>
      <DialogHeader>
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="size-6 text-destructive" />
        </div>
        <DialogTitle className="text-center">Delete file</DialogTitle>
        <DialogDescription className="text-center">
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">&ldquo;{filename}&rdquo;</span>?
          <br />
          This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="mt-2 sm:justify-center">
        <Button variant="outline" onClick={() => setOpen(false)} className="min-w-24">
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="min-w-24"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  // If showing trigger button (uncontrolled mode with visible trigger)
  if (showTrigger) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <Trash2 className="size-4 text-muted-foreground" />
          </Button>
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  // Controlled mode (no trigger, controlled externally)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {dialogContent}
    </Dialog>
  );
}
