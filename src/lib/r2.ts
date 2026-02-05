import {
  S3Client,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Types
export type FileVisibility = "public" | "private";

export interface FileValidationOptions {
  allowedTypes: string[];
  maxSize: number; // in bytes
}

// Default validation options
export const DEFAULT_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];
export const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

// Lazy initialization to avoid build errors when env vars aren't set
let _r2Client: S3Client | null = null;
let _bucketName: string | null = null;

function getR2Config() {
  if (!process.env.R2_ACCOUNT_ID) {
    throw new Error("R2_ACCOUNT_ID is not set");
  }
  if (!process.env.R2_ACCESS_KEY_ID) {
    throw new Error("R2_ACCESS_KEY_ID is not set");
  }
  if (!process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error("R2_SECRET_ACCESS_KEY is not set");
  }
  if (!process.env.R2_BUCKET_NAME) {
    throw new Error("R2_BUCKET_NAME is not set");
  }

  return {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME,
    publicUrl: process.env.R2_PUBLIC_URL,
  };
}

function getR2Client(): S3Client {
  if (!_r2Client) {
    const config = getR2Config();
    _r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }
  return _r2Client;
}

function getBucketName(): string {
  if (!_bucketName) {
    _bucketName = getR2Config().bucketName;
  }
  return _bucketName;
}

/**
 * Generate a unique file key for R2 storage
 */
export function generateFileKey(
  userId: string,
  filename: string,
  visibility: FileVisibility
): string {
  const timestamp = Date.now();
  const randomSuffix = crypto.randomUUID().slice(0, 8);
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const prefix = visibility === "public" ? "public" : "private";

  return `${prefix}/${userId}/${timestamp}-${randomSuffix}-${sanitizedFilename}`;
}

/**
 * Get a presigned URL for uploading a file to R2
 */
export async function getUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: getBucketName(),
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(getR2Client(), command, { expiresIn });
}

/**
 * Get a presigned URL for downloading a private file from R2
 */
export async function getDownloadUrl(
  key: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });

  return getSignedUrl(getR2Client(), command, { expiresIn });
}

/**
 * Get the public URL for a file (only for public visibility files)
 */
export function getPublicUrl(key: string): string | null {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl) {
    return null;
  }
  return `${publicUrl}/${key}`;
}

/**
 * Delete a file from R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });

  await getR2Client().send(command);
}

/**
 * Check if a file exists in R2
 */
export async function fileExistsInR2(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: getBucketName(),
      Key: key,
    });
    await getR2Client().send(command);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate file metadata before upload
 */
export function validateFile(
  contentType: string,
  size: number,
  options: FileValidationOptions = {
    allowedTypes: DEFAULT_ALLOWED_TYPES,
    maxSize: DEFAULT_MAX_SIZE,
  }
): { valid: true } | { valid: false; error: string } {
  if (!options.allowedTypes.includes(contentType)) {
    return {
      valid: false,
      error: `File type "${contentType}" is not allowed. Allowed types: ${options.allowedTypes.join(", ")}`,
    };
  }

  if (size > options.maxSize) {
    const maxSizeMB = Math.round(options.maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}
