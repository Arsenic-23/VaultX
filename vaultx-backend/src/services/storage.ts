import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: "us-east-1", // required by AWS SDK (B2 ignores this)
  endpoint: process.env.STORAGE_ENDPOINT, // Backblaze endpoint
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY!,
    secretAccessKey: process.env.STORAGE_SECRET_KEY!,
  },
  forcePathStyle: true, 
});

const BUCKET = process.env.STORAGE_BUCKET!;

export async function generateUploadUrl(
  key: string,
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(client, command, {
    expiresIn: 300, // 5 minutes
  });
}

export async function generateDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(client, command, {
    expiresIn: 60, // 1 minute
  });
}
