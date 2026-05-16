import { json, error } from '@sveltejs/kit';
import { releaseBeat } from '$lib/server/queries';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    throw error(401, 'Debes iniciar sesión');
  }

  const { beatId } = await request.json();

  if (!beatId) {
    throw error(400, 'Missing beatId');
  }

  await releaseBeat(beatId, locals.user.uid);

  return json({ status: 'released' });
};
