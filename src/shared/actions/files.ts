"use server";

import { db } from "@/lib/db";
import { file } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/guards";
import { eq, and, isNull } from "drizzle-orm";
import {
  generateFileKey,
  getUploadUrl,
  getDownloadUrl,
  getPublicUrl,
  deleteFromR2,
  validateFile,
  type FileVisibility,
  type FileValidationOptions,
} from "@/lib/r2";

interface RequestUploadUrlInput {
  filename: string;
  contentType: string;
  size: number;
  visibility?: FileVisibility;
  validationOptions?: FileValidationOptions;
}

interface RequestUploadUrlResult {
  uploadUrl: string;
  fileId: string;
  key: string;
}

/**
 * Request a presigned URL for uploading a file
 */
export async function requestUploadUrl(
  input: RequestUploadUrlInput
): Promise<
  | { success: true; data: RequestUploadUrlResult }
  | { success: false; error: string }
> {
  const session = await requireAuth();
  const userId = session.user.id;

  const { filename, contentType, size, visibility = "private" } = input;

  // Validate file metadata
  const validation = validateFile(contentType, size, input.validationOptions);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Generate unique key
  const key = generateFileKey(userId, filename, visibility);

  // Create file record in database (pending upload)
  const fileId = crypto.randomUUID();
  await db.insert(file).values({
    id: fileId,
    userId,
    key,
    filename,
    contentType,
    size,
    visibility,
  });

  // Generate presigned upload URL
  const uploadUrl = await getUploadUrl(key, contentType);

  return {
    success: true,
    data: {
      uploadUrl,
      fileId,
      key,
    },
  };
}

/**
 * Confirm that a file upload was completed successfully
 */
export async function confirmUpload(
  fileId: string
): Promise<
  | { success: true; url: string | null }
  | { success: false; error: string }
> {
  const session = await requireAuth();
  const userId = session.user.id;

  // Get file record and verify ownership
  const [fileRecord] = await db
    .select()
    .from(file)
    .where(and(eq(file.id, fileId), eq(file.userId, userId), isNull(file.deletedAt)))
    .limit(1);

  if (!fileRecord) {
    return { success: false, error: "File not found or access denied" };
  }

  // Return the appropriate URL based on visibility
  const url =
    fileRecord.visibility === "public"
      ? getPublicUrl(fileRecord.key)
      : await getDownloadUrl(fileRecord.key);

  return { success: true, url };
}

/**
 * Delete a file (soft delete in DB, optionally hard delete from R2)
 */
export async function deleteFile(
  fileId: string,
  hardDelete: boolean = false
): Promise<{ success: true } | { success: false; error: string }> {
  const session = await requireAuth();
  const userId = session.user.id;

  // Get file record and verify ownership
  const [fileRecord] = await db
    .select()
    .from(file)
    .where(and(eq(file.id, fileId), eq(file.userId, userId), isNull(file.deletedAt)))
    .limit(1);

  if (!fileRecord) {
    return { success: false, error: "File not found or access denied" };
  }

  // Soft delete in database
  await db
    .update(file)
    .set({ deletedAt: new Date() })
    .where(eq(file.id, fileId));

  // Optionally hard delete from R2
  if (hardDelete) {
    await deleteFromR2(fileRecord.key);
  }

  return { success: true };
}

/**
 * Get the URL for accessing a file
 */
export async function getFileUrl(
  fileId: string
): Promise<
  | { success: true; url: string; expiresAt?: Date }
  | { success: false; error: string }
> {
  const session = await requireAuth();
  const userId = session.user.id;

  // Get file record
  const [fileRecord] = await db
    .select()
    .from(file)
    .where(and(eq(file.id, fileId), isNull(file.deletedAt)))
    .limit(1);

  if (!fileRecord) {
    return { success: false, error: "File not found" };
  }

  // Check access: owner or public file
  if (fileRecord.userId !== userId && fileRecord.visibility !== "public") {
    return { success: false, error: "Access denied" };
  }

  // Return URL based on visibility
  if (fileRecord.visibility === "public") {
    const publicUrl = getPublicUrl(fileRecord.key);
    if (publicUrl) {
      return { success: true, url: publicUrl };
    }
    // Fall back to presigned URL if public URL not configured
    const url = await getDownloadUrl(fileRecord.key);
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour
    return { success: true, url, expiresAt };
  }

  // Private file: return presigned URL
  const url = await getDownloadUrl(fileRecord.key);
  const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour
  return { success: true, url, expiresAt };
}

/**
 * Get all files for the current user
 */
export async function getUserFiles(): Promise<
  | { success: true; files: typeof file.$inferSelect[] }
  | { success: false; error: string }
> {
  const session = await requireAuth();
  const userId = session.user.id;

  const files = await db
    .select()
    .from(file)
    .where(and(eq(file.userId, userId), isNull(file.deletedAt)))
    .orderBy(file.uploadedAt);

  return { success: true, files };
}
