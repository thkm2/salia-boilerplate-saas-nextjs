"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  ImageIcon,
  FileJson,
  File,
  MoreVertical,
  Trash2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { DeleteFileDialog } from "./delete-file-dialog";
import { getFileUrl } from "@/shared/actions/files";

interface FileRecord {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: Date;
}

interface FileCardProps {
  file: FileRecord;
  onDeleted: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function getFileTypeLabel(contentType: string): string {
  if (contentType.startsWith("image/")) return "Image";
  if (contentType === "application/pdf") return "PDF";
  if (contentType === "application/json") return "JSON";
  if (contentType.startsWith("text/")) return "Text";
  return "File";
}

function getFileIcon(contentType: string) {
  const iconClass = "size-6";
  if (contentType.startsWith("image/")) {
    return <ImageIcon className={iconClass} />;
  }
  if (contentType === "application/pdf") {
    return <FileText className={iconClass} />;
  }
  if (contentType === "application/json") {
    return <FileJson className={iconClass} />;
  }
  return <File className={iconClass} />;
}

function getFileColor(contentType: string): string {
  if (contentType.startsWith("image/")) return "bg-violet-500/10 text-violet-600 dark:text-violet-400";
  if (contentType === "application/pdf") return "bg-red-500/10 text-red-600 dark:text-red-400";
  if (contentType === "application/json") return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  if (contentType.startsWith("text/")) return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
  return "bg-foreground/5 text-muted-foreground";
}

export function FileCard({ file, onDeleted }: FileCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  async function handleDownload() {
    setIsDownloading(true);
    const result = await getFileUrl(file.id);
    setIsDownloading(false);

    if (result.success) {
      const link = document.createElement("a");
      link.href = result.url;
      link.download = file.filename;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error(result.error);
    }
  }

  async function handlePreview() {
    const result = await getFileUrl(file.id);
    if (result.success) {
      window.open(result.url, "_blank", "noopener,noreferrer");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <>
      <div
        className={cn(
          "group relative flex flex-col rounded-xl border bg-card p-4 transition-all duration-200",
          "hover:shadow-md hover:border-foreground/10"
        )}
      >
        {/* File icon and type */}
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105",
              getFileColor(file.contentType)
            )}
          >
            {getFileIcon(file.contentType)}
          </div>

          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handlePreview}>
                <Eye className="size-4" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload} disabled={isDownloading}>
                <Download className="size-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* File info */}
        <div className="mt-4 min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium" title={file.filename}>
            {file.filename}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{getFileTypeLabel(file.contentType)}</span>
            <span className="text-foreground/20">·</span>
            <span>{formatFileSize(file.size)}</span>
          </div>
        </div>

        {/* Footer with date */}
        <div className="mt-4 border-t border-border/50 pt-3">
          <span className="text-xs text-muted-foreground">
            {formatDate(file.uploadedAt)}
          </span>
        </div>
      </div>

      {/* Delete dialog - controlled externally */}
      <DeleteFileDialog
        fileId={file.id}
        filename={file.filename}
        onDeleted={onDeleted}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
