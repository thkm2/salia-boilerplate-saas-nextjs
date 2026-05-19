import {
  S3Client,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
 * Generate a unique, unguessable file key for R2 storage.
 * Format: {userId}/{uuid}-{sanitizedFilename}
 * Security relies on the UUID v4 (122 bits of entropy), not on access control.
 */
export function generateFileKey(userId: string, filename: string): string {
  const uuid = crypto.randomUUID();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");

  return `${userId}/${uuid}-${sanitizedFilename}`;
}

/**
 * Get a presigned URL for uploading a file to R2
 */
export async function getUploadUrl(
  key: string,
  contentType: string,
  size: number,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: getBucketName(),
    Key: key,
    ContentType: contentType,
    ContentLength: size,
  });

  return getSignedUrl(getR2Client(), command, { expiresIn });
}

/**
 * Build the direct public URL for a file in R2.
 * Requires the bucket to be publicly accessible and R2_PUBLIC_URL configured.
 */
export function buildPublicUrl(key: string): string {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl) {
    throw new Error("R2_PUBLIC_URL is not set");
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
