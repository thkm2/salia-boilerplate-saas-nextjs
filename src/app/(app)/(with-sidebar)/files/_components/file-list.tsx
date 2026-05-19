"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  FileText,
  ImageIcon,
  FileJson,
  File,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/shared/components/ui/empty";
import { DeleteFileDialog } from "./delete-file-dialog";
import { FileUpload } from "./file-upload";
import { FileCard } from "./file-card";
import { getFileUrl } from "@/shared/actions/files";

interface FileRecord {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: Date;
}

interface FileListProps {
  files: FileRecord[];
}

type ViewMode = "grid" | "list";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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
  if (contentType.startsWith("image/")) {
    return <ImageIcon className="size-4" />;
  }
  if (contentType === "application/pdf") {
    return <FileText className="size-4" />;
  }
  if (contentType === "application/json") {
    return <FileJson className="size-4" />;
  }
  return <File className="size-4" />;
}

function getFileColor(contentType: string): string {
  if (contentType.startsWith("image/")) return "bg-violet-500/10 text-violet-600 dark:text-violet-400";
  if (contentType === "application/pdf") return "bg-red-500/10 text-red-600 dark:text-red-400";
  if (contentType === "application/json") return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  if (contentType.startsWith("text/")) return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
  return "bg-foreground/5 text-muted-foreground";
}

export function FileList({ files: initialFiles }: FileListProps) {
  const router = useRouter();
  const [files, setFiles] = useState(initialFiles);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync state when server data changes (after router.refresh())
  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  const filteredFiles = files.filter((file) =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleRefresh() {
    router.refresh();
  }

  async function handleDownload(fileId: string, filename: string) {
    setDownloadingId(fileId);
    const result = await getFileUrl(fileId);
    setDownloadingId(null);

    if (result.success) {
      const link = document.createElement("a");
      link.href = result.url;
      link.download = filename;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error(result.error);
    }
  }

  function handleDeleted(fileId: string) {
    // Optimistic update for instant feedback
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    // Sync with server to update storage stats in header
    router.refresh();
  }

  // Empty state
  if (files.length === 0) {
    return (
      <div className="space-y-6">
        <FileUpload onUploaded={handleRefresh} variant="dropzone" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border bg-background p-1 gap-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("grid")}
              className="rounded-md"
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("list")}
              className="rounded-md"
            >
              <List className="size-4" />
            </Button>
          </div>

          <FileUpload onUploaded={handleRefresh} />
        </div>
      </div>

      {/* File count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          {filteredFiles.length} {filteredFiles.length === 1 ? "file" : "files"}
        </span>
        {searchQuery && files.length !== filteredFiles.length && (
          <span className="text-foreground/40">
            (filtered from {files.length})
          </span>
        )}
      </div>

      {/* No results */}
      {filteredFiles.length === 0 && searchQuery && (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>No files found</EmptyTitle>
            <EmptyDescription>
              No files match &ldquo;{searchQuery}&rdquo;
            </EmptyDescription>
          </EmptyHeader>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        </Empty>
      )}

      {/* Grid view */}
      {viewMode === "grid" && filteredFiles.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFiles.map((file, index) => (
            <div
              key={file.id}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
            >
              <FileCard
                file={file}
                onDeleted={() => handleDeleted(file.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {viewMode === "list" && filteredFiles.length > 0 && (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40%]">Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file, index) => (
                <TableRow
                  key={file.id}
                  className="group animate-in fade-in slide-in-from-left-2"
                  style={{ animationDelay: `${index * 30}ms`, animationFillMode: "backwards" }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105",
                          getFileColor(file.contentType)
                        )}
                      >
                        {getFileIcon(file.contentType)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium" title={file.filename}>
                          {file.filename}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {getFileTypeLabel(file.contentType)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatFileSize(file.size)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(file.uploadedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDownload(file.id, file.filename)}
                        disabled={downloadingId === file.id}
                      >
                        <Download className="size-4" />
                      </Button>
                      <DeleteFileDialog
                        fileId={file.id}
                        filename={file.filename}
                        onDeleted={() => handleDeleted(file.id)}
                        showTrigger
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
