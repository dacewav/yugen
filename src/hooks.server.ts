import type { Handle } from '@sveltejs/kit';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let initialized = false;
let _auth: ReturnType<typeof getAuth>;
let _db: ReturnType<typeof getFirestore>;

function init() {
  if (initialized) return;
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) return;

  const app = getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      })
    : getApps()[0];
  _auth = getAuth(app);
  _db = getFirestore(app);
  initialized = true;
}

export const handle: Handle = async ({ event, resolve }) => {
  init();
  if (!_auth) return resolve(event);

  const sessionCookie = event.cookies.get('__session');

  if (sessionCookie) {
    try {
      const decoded = await _auth.verifySessionCookie(sessionCookie, true);

      // Verify claims version — force logout if stale
      let claimsVersion = 0;
      if (decoded.memberId) {
        try {
          const memberDoc = await _db.doc(`members/${decoded.memberId}`).get();
          if (memberDoc.exists) {
            claimsVersion = memberDoc.data()?.claimsVersion ?? 0;
          }
        } catch {
          // Firestore read failed — allow session but skip version check
        }
      }

      if (decoded.claimsVersion !== undefined && decoded.claimsVersion !== claimsVersion) {
        event.cookies.delete('__session', { path: '/' });
        event.locals.user = null;
      } else {
        event.locals.user = {
          uid: decoded.uid,
          email: decoded.email ?? '',
          role: (decoded.role as string ?? 'viewer') as 'owner' | 'admin' | 'editor' | 'member' | 'viewer',
          memberId: (decoded.memberId as string) ?? null,
          crewName: (decoded.crewName as string) ?? null,
          claimsVersion,
        };
      }
    } catch {
      // Invalid or expired cookie — clear it
      event.cookies.delete('__session', { path: '/' });
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};
