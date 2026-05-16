import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '$env/dynamic/private';

// ── Public bucket: covers, avatars, previews ──
const r2Public = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: env.R2_SECRET_ACCESS_KEY ?? '',
  },
});

// ── Private bucket: full tracks, stems, deliverables ──
const r2Private = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_PRIVATE_ACCESS_KEY_ID ?? '',
    secretAccessKey: env.R2_PRIVATE_SECRET_ACCESS_KEY ?? '',
  },
});

export async function uploadPublic(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  await r2Public.send(new PutObjectCommand({
    Bucket: env.R2_PUBLIC_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  return `${env.R2_PUBLIC_CDN_URL}/${key}`;
}

export async function uploadPrivate(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  await r2Private.send(new PutObjectCommand({
    Bucket: env.R2_PRIVATE_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'private, max-age=3600',
  }));
  return key;
}

export async function getPrivateDownloadUrl(key: string): Promise<string> {
  return getSignedUrl(
    r2Private,
    new GetObjectCommand({ Bucket: env.R2_PRIVATE_BUCKET, Key: key }),
    { expiresIn: 3600 }
  );
}

export async function getPrivateUploadUrl(
  key: string,
  contentType: string,
  maxSizeBytes: number
): Promise<string> {
  return getSignedUrl(
    r2Private,
    new PutObjectCommand({
      Bucket: env.R2_PRIVATE_BUCKET,
      Key: key,
      ContentType: contentType,
      ContentLength: maxSizeBytes,
    }),
    { expiresIn: 1800 }
  );
}

export async function deletePublic(key: string): Promise<void> {
  await r2Public.send(new DeleteObjectCommand({
    Bucket: env.R2_PUBLIC_BUCKET,
    Key: key,
  }));
}

export async function deletePrivate(key: string): Promise<void> {
  await r2Private.send(new DeleteObjectCommand({
    Bucket: env.R2_PRIVATE_BUCKET,
    Key: key,
  }));
}

// ── Key naming conventions ──
export const r2Keys = {
  memberAvatar: (memberId: string) => `members/${memberId}/avatar.webp`,
  memberBanner: (memberId: string) => `members/${memberId}/banner.webp`,
  beatCover: (beatId: string) => `beats/${beatId}/cover.webp`,
  beatPreview: (beatId: string) => `beats/${beatId}/preview.mp3`,
  beatWaveform: (beatId: string) => `beats/${beatId}/waveform.json`,
  beatFull: (beatId: string) => `beats/${beatId}/full.mp3`,
  beatFullWav: (beatId: string) => `beats/${beatId}/full.wav`,
  kitCover: (kitId: string) => `kits/${kitId}/cover.webp`,
  kitZip: (kitId: string) => `kits/${kitId}/kit.zip`,
  orderStem: (orderId: string, filename: string) => `orders/${orderId}/stems/${filename}`,
  orderDeliverable: (orderId: string, filename: string) => `orders/${orderId}/deliverables/${filename}`,
  dropCover: (dropId: string) => `drops/${dropId}/cover.webp`,
  dropTeaser: (dropId: string) => `drops/${dropId}/teaser.mp3`,
  postCover: (postId: string) => `posts/${postId}/cover.webp`,
  zineEdition: (zineId: string) => `zine/${zineId}/edition.pdf`,
} as const;
