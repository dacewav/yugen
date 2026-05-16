import { getPrivateUploadUrl } from '$lib/server/r2';
import { requireAuth } from '$lib/server/auth';
import { rateLimit } from '$lib/server/rate-limit';
import { UploadMetaSchema } from '$utils/validators';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  const user = requireAuth(locals);
  await rateLimit('uploads', user.uid);

  const body = await request.json();
  const result = UploadMetaSchema.safeParse(body);

  if (!result.success) {
    throw error(400, result.error.issues[0].message);
  }

  const { contentType, fileSize, fileName } = result.data;

  // Generate a unique key for the upload
  const timestamp = Date.now();
  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const key = `uploads/${user.uid}/${timestamp}-${sanitized}`;

  const uploadUrl = await getPrivateUploadUrl(key, contentType, fileSize);

  return json({ uploadUrl, key });
};
