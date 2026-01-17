import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";

/**
 * Upload a file to S3
 * @param key - S3 object key (file path)
 * @param body - File content (Buffer, Stream, or string)
 * @param contentType - MIME type of the file
 * @returns The uploaded object's key
 */
export async function uploadToS3(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType?: string
): Promise<string> {
  if (!BUCKET_NAME) {
    throw new Error("AWS_S3_BUCKET_NAME environment variable is required");
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return key;
}

/**
 * Download a file from S3
 * @param key - S3 object key (file path)
 * @returns The file content as a stream
 */
export async function downloadFromS3(key: string) {
  if (!BUCKET_NAME) {
    throw new Error("AWS_S3_BUCKET_NAME environment variable is required");
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const response = await s3Client.send(command);
  return response.Body;
}

/**
 * Generate a presigned URL for uploading/downloading files
 * @param key - S3 object key (file path)
 * @param expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns Presigned URL
 */
export async function getPresignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  if (!BUCKET_NAME) {
    throw new Error("AWS_S3_BUCKET_NAME environment variable is required");
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Delete a file from S3
 * @param key - S3 object key (file path)
 */
export async function deleteFromS3(key: string): Promise<void> {
  if (!BUCKET_NAME) {
    throw new Error("AWS_S3_BUCKET_NAME environment variable is required");
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * List objects in S3 bucket (with optional prefix filter)
 * @param prefix - Optional prefix to filter objects
 * @param maxKeys - Maximum number of keys to return (default: 1000)
 * @returns Array of object keys
 */
export async function listObjects(prefix?: string, maxKeys: number = 1000): Promise<string[]> {
  if (!BUCKET_NAME) {
    throw new Error("AWS_S3_BUCKET_NAME environment variable is required");
  }

  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: prefix,
    MaxKeys: maxKeys,
  });

  const response = await s3Client.send(command);
  return (response.Contents || []).map((obj) => obj.Key || "").filter(Boolean);
}

/**
 * Get the S3 URL for a file (public or private)
 * @param key - S3 object key (file path)
 * @returns S3 URL
 */
export function getS3Url(key: string): string {
  if (!BUCKET_NAME) {
    throw new Error("AWS_S3_BUCKET_NAME environment variable is required");
  }

  const region = process.env.AWS_REGION || "us-east-1";
  return `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;
}
