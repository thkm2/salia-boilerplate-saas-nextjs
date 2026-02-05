"use server";

import { db } from "@/lib/db";
import { file } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/guards";
import { eq, and } from "drizzle-orm";
import {
  generateFileKey,
  getUploadUrl,
  getDownloadUrl,
  getPublicUrl,
  deleteFromR2,
  fileExistsInR2,
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
  key: string;
  filename: string;
  contentType: string;
  size: number;
  visibility: FileVisibility;
}

/**
 * Request a presigned URL for uploading a file
 * Returns metadata needed for confirmUpload (no DB record created yet)
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

  // Generate presigned upload URL with size enforcement
  const uploadUrl = await getUploadUrl(key, contentType, size);

  return {
    success: true,
    data: {
      uploadUrl,
      key,
      filename,
      contentType,
      size,
      visibility,
    },
  };
}

interface ConfirmUploadInput {
  key: string;
  filename: string;
  contentType: string;
  size: number;
  visibility: FileVisibility;
}

/**
 * Confirm that a file upload was completed successfully
 * Verifies the file exists in R2, then creates the DB record
 */
export async function confirmUpload(
  input: ConfirmUploadInput
): Promise<
  | { success: true; fileId: string; url: string | null }
  | { success: false; error: string }
> {
  const session = await requireAuth();
  const userId = session.user.id;

  const { key, filename, contentType, size, visibility } = input;

  // Validate key belongs to current user (format: {visibility}/{userId}/...)
  const expectedPrefix = `${visibility}/${userId}/`;
  if (!key.startsWith(expectedPrefix)) {
    return { success: false, error: "Invalid file key" };
  }

  // Verify the file actually exists in R2
  const exists = await fileExistsInR2(key);
  if (!exists) {
    return { success: false, error: "File not found in storage. Upload may have failed." };
  }

  // Create file record in database now that we know the file exists
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

  // Return the appropriate URL based on visibility
  const url =
    visibility === "public"
      ? getPublicUrl(key)
      : await getDownloadUrl(key);

  return { success: true, fileId, url };
}

/**
 * Delete a file (hard delete: removes from R2 and DB)
 */
export async function deleteFile(
  fileId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const session = await requireAuth();
  const userId = session.user.id;

  // Get file record and verify ownership
  const [fileRecord] = await db
    .select()
    .from(file)
    .where(and(eq(file.id, fileId), eq(file.userId, userId)))
    .limit(1);

  if (!fileRecord) {
    return { success: false, error: "File not found or access denied" };
  }

  // Hard delete: R2 first, then DB
  await deleteFromR2(fileRecord.key);
  await db.delete(file).where(eq(file.id, fileId));

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
    .where(eq(file.id, fileId))
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
    .where(eq(file.userId, userId))
    .orderBy(file.uploadedAt);

  return { success: true, files };
}
