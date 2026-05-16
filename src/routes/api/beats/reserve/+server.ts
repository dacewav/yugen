import { json, error } from '@sveltejs/kit';
import { reserveBeat } from '$lib/server/queries';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    throw error(401, 'Debes iniciar sesión para reservar un beat');
  }

  const { beatId } = await request.json();

  if (!beatId) {
    throw error(400, 'Missing beatId');
  }

  const reserved = await reserveBeat(beatId, locals.user.uid);

  if (!reserved) {
    throw error(409, 'El beat ya no está disponible o fue reservado por otro comprador');
  }

  return json({ status: 'reserved', expiresIn: 300 }); // 5 min
};
