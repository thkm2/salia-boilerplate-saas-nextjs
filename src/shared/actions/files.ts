"use server";

import { db } from "@/lib/db";
import { file } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/guards";
import { eq, and } from "drizzle-orm";
import {
  generateFileKey,
  getUploadUrl,
  buildPublicUrl,
  deleteFromR2,
  fileExistsInR2,
  validateFile,
  type FileValidationOptions,
} from "@/lib/r2";

interface RequestUploadUrlInput {
  filename: string;
  contentType: string;
  size: number;
  validationOptions?: FileValidationOptions;
}

interface RequestUploadUrlResult {
  uploadUrl: string;
  key: string;
  filename: string;
  contentType: string;
  size: number;
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

  const { filename, contentType, size } = input;

  // Validate file metadata
  const validation = validateFile(contentType, size, input.validationOptions);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Generate unguessable key (UUID v4-based)
  const key = generateFileKey(userId, filename);

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
    },
  };
}

interface ConfirmUploadInput {
  key: string;
  filename: string;
  contentType: string;
  size: number;
}

/**
 * Confirm that a file upload was completed successfully
 * Verifies the file exists in R2, then creates the DB record
 */
export async function confirmUpload(
  input: ConfirmUploadInput
): Promise<
  | { success: true; fileId: string; url: string }
  | { success: false; error: string }
> {
  const session = await requireAuth();
  const userId = session.user.id;

  const { key, filename, contentType, size } = input;

  // Validate key belongs to current user (format: {userId}/...)
  if (!key.startsWith(`${userId}/`)) {
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
  });

  return { success: true, fileId, url: buildPublicUrl(key) };
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
 * Get the public URL for accessing a file.
 * Authorization is by ownership: only the owner can resolve a fileId to its URL.
 * Once the URL is known, anyone with it can access the file (security by obscurity).
 */
export async function getFileUrl(
  fileId: string
): Promise<
  | { success: true; url: string }
  | { success: false; error: string }
> {
  const session = await requireAuth();
  const userId = session.user.id;

  const [fileRecord] = await db
    .select()
    .from(file)
    .where(eq(file.id, fileId))
    .limit(1);

  if (!fileRecord) {
    return { success: false, error: "File not found" };
  }

  if (fileRecord.userId !== userId) {
    return { success: false, error: "Access denied" };
  }

  return { success: true, url: buildPublicUrl(fileRecord.key) };
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
