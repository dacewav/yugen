import { json, error } from '@sveltejs/kit';
import { adminAuth } from '$lib/server/firebase-admin';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { email } = await request.json();

  if (!email || typeof email !== 'string') {
    throw error(400, 'Missing email');
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Generate a magic link via Firebase Admin
    const actionCodeSettings = {
      url: `${new URL(request.url).origin}/api/auth/magic-link/confirm`,
      handleCodeInApp: true,
    };

    const link = await adminAuth().generateSignInWithEmailLink(normalizedEmail, actionCodeSettings);

    // TODO: Send email via Resend with the magic link
    // For now, return the link (dev mode)
    // In production, send via email and don't return the link
    console.log(`[magic-link] ${normalizedEmail} → ${link}`);

    return json({ status: 'sent', message: 'Revisá tu email para el link de acceso.' });
  } catch (err) {
    console.error('[magic-link] Error:', err);
    throw error(500, 'No se pudo enviar el link. Intentá de nuevo.');
  }
};
