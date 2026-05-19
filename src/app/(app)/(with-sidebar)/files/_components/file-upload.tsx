"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, CloudUpload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { requestUploadUrl, confirmUpload } from "@/shared/actions/files";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/json",
];

interface FileUploadProps {
  onUploaded: () => void;
  variant?: "button" | "dropzone";
}

export function FileUpload({ onUploaded, variant = "button" }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    // Client-side validation
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large. Maximum size is 10MB.");
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("File type not allowed.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    // Step 1: Get presigned upload URL
    const uploadResult = await requestUploadUrl({
      filename: file.name,
      contentType: file.type,
      size: file.size,
    });

    if (!uploadResult.success) {
      toast.error(uploadResult.error);
      setIsUploading(false);
      setUploadProgress(0);
      return;
    }

    setUploadProgress(30);

    const { uploadUrl, key, filename, contentType, size } = uploadResult.data;

    // Step 2: Upload to R2
    try {
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": contentType,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }
    } catch {
      toast.error("Failed to upload file");
      setIsUploading(false);
      setUploadProgress(0);
      return;
    }

    setUploadProgress(70);

    // Step 3: Confirm upload in database
    const confirmResult = await confirmUpload({
      key,
      filename,
      contentType,
      size,
    });

    setUploadProgress(100);

    // Small delay to show completion
    await new Promise((resolve) => setTimeout(resolve, 300));

    setIsUploading(false);
    setUploadProgress(0);

    if (confirmResult.success) {
      toast.success("File uploaded successfully");
      onUploaded();
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } else {
      toast.error(confirmResult.error);
    }
  }, [onUploaded]);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await uploadFile(file);
  }, [uploadFile]);

  if (variant === "dropzone") {
    return (
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "group relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 transition-all duration-300",
          isDragging
            ? "border-foreground/40 bg-foreground/[0.03] scale-[1.01]"
            : "border-border hover:border-foreground/20 hover:bg-foreground/[0.02]",
          isUploading && "pointer-events-none"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept={ALLOWED_TYPES.join(",")}
          disabled={isUploading}
        />

        {/* Upload icon with animation */}
        <div
          className={cn(
            "flex size-16 items-center justify-center rounded-2xl bg-foreground/[0.05] transition-all duration-300",
            isDragging && "scale-110 bg-foreground/[0.08]",
            "group-hover:scale-105 group-hover:bg-foreground/[0.07]"
          )}
        >
          <CloudUpload
            className={cn(
              "size-7 text-muted-foreground transition-all duration-300",
              isDragging && "text-foreground scale-110",
              "group-hover:text-foreground/70"
            )}
          />
        </div>

        {/* Text content */}
        <div className="text-center">
          {isUploading ? (
            <div className="space-y-3">
              <p className="text-sm font-medium">Uploading...</p>
              {/* Progress bar */}
              <div className="mx-auto h-1.5 w-48 overflow-hidden rounded-full bg-foreground/10">
                <div
                  className="h-full rounded-full bg-foreground transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium">
                {isDragging ? "Drop your file here" : "Drag and drop your file here"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                or click to browse
              </p>
            </>
          )}
        </div>

        {/* File type hint */}
        {!isUploading && (
          <p className="text-xs text-muted-foreground/70">
            Images, PDFs, text files up to 10MB
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept={ALLOWED_TYPES.join(",")}
        disabled={isUploading}
      />
      <Button
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="gap-2"
      >
        <Upload className="size-4" />
        {isUploading ? "Uploading..." : "Upload file"}
      </Button>
    </div>
  );
}
