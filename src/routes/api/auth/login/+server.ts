import { json, error } from '@sveltejs/kit';
import { adminAuth, adminDb, FieldValue } from '$lib/server/firebase-admin';
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

    // Create or update client document in Firestore (for non-crew users)
    try {
      const decoded = await adminAuth().verifyIdToken(idToken);
      const uid = decoded.uid;

      // Check if user is crew (has custom claims with memberId)
      const isCrew = !!decoded.memberId;

      if (!isCrew) {
        const clientRef = adminDb().doc(`clients/${uid}`);
        const clientDoc = await clientRef.get();

        if (!clientDoc.exists) {
          // New client — create document
          await clientRef.set({
            uid,
            email: decoded.email ?? '',
            displayName: decoded.name ?? decoded.email?.split('@')[0] ?? '',
            photoURL: decoded.picture ?? null,
            purchaseHistory: [],
            favorites: [],
            createdAt: FieldValue.serverTimestamp(),
            lastLoginAt: FieldValue.serverTimestamp(),
          });
        } else {
          // Existing client — update last login
          await clientRef.update({
            lastLoginAt: FieldValue.serverTimestamp(),
            // Update email/photo in case they changed
            email: decoded.email ?? clientDoc.data()?.email ?? '',
            displayName: decoded.name ?? clientDoc.data()?.displayName ?? '',
            photoURL: decoded.picture ?? clientDoc.data()?.photoURL ?? null,
          });
        }
      }
    } catch {
      // Token verification for client creation failed — session cookie still valid
      // This is non-critical; client will be created on next interaction
    }

    return json({ status: 'ok' });
  } catch {
    throw error(401, 'Invalid ID token');
  }
};
