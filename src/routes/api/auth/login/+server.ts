import { json, error } from '@sveltejs/kit';
import { adminAuth } from '$lib/server/firebase-admin';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { idToken } = await request.json();

  if (!idToken) {
    throw error(400, 'Missing ID token');
  }

  const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days

  try {
    const sessionCookie = await adminAuth().createSessionCookie(idToken, { expiresIn });

    cookies.set('__session', sessionCookie, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: expiresIn / 1000,
      path: '/',
    });

    return json({ status: 'ok' });
  } catch {
    throw error(401, 'Invalid ID token');
  }
};
