import { requireAuth } from '$lib/server/auth';
import { adminDb } from '$lib/server/firebase-admin';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  requireAuth(locals);

  const { key, orderId, purpose } = await request.json();

  if (!key) {
    throw error(400, 'Missing key');
  }

  if (orderId && purpose) {
    await adminDb().doc(`orders/${orderId}`).update({
      [`uploads.${purpose}`]: key,
      updatedAt: new Date(),
    });
  }

  return json({ status: 'ok', key });
};
