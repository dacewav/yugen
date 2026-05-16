import { json, error } from '@sveltejs/kit';
import { adminDb, FieldValue } from '$lib/server/firebase-admin';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    throw error(401, 'Debes iniciar sesión');
  }

  const { beatId } = await request.json();

  if (!beatId || typeof beatId !== 'string') {
    throw error(400, 'Missing beatId');
  }

  const clientRef = adminDb().doc(`clients/${locals.user.uid}`);

  try {
    const clientDoc = await clientRef.get();
    if (!clientDoc.exists) {
      throw error(404, 'Cliente no encontrado');
    }

    const favorites: string[] = clientDoc.data()?.favorites ?? [];
    const isFav = favorites.includes(beatId);

    if (isFav) {
      // Remove from favorites
      await clientRef.update({
        favorites: FieldValue.arrayRemove(beatId),
      });
      return json({ status: 'removed', isFavorite: false });
    } else {
      // Add to favorites
      await clientRef.update({
        favorites: FieldValue.arrayUnion(beatId),
      });
      return json({ status: 'added', isFavorite: true });
    }
  } catch (e) {
    if (e && typeof e === 'object' && 'status' in e) throw e;
    throw error(500, 'Error al actualizar favoritos');
  }
};
