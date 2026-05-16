import { redirect } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  try {
    const db = adminDb();
    const clientDoc = await db.doc(`clients/${locals.user.uid}`).get();

    if (!clientDoc.exists) {
      return { favorites: [] };
    }

    const favoriteIds: string[] = clientDoc.data()?.favorites ?? [];

    if (favoriteIds.length === 0) {
      return { favorites: [] };
    }

    // Fetch the actual beat documents
    // Firestore 'in' query supports max 30 items
    const chunks: string[][] = [];
    for (let i = 0; i < favoriteIds.length; i += 30) {
      chunks.push(favoriteIds.slice(i, i + 30));
    }

    const beats: Record<string, unknown>[] = [];
    for (const chunk of chunks) {
      const snap = await db.collection('beats')
        .where('__name__', 'in', chunk)
        .get();
      for (const doc of snap.docs) {
        beats.push({ id: doc.id, ...doc.data() });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { favorites: beats as any };
  } catch {
    return { favorites: [] };
  }
};
