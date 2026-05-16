import { error } from '@sveltejs/kit';
import { getBeatBySlug } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const beat = await getBeatBySlug(params.slug);
    if (!beat) {
      throw error(404, 'Beat no encontrado');
    }
    return { beat };
  } catch (e) {
    if (e && typeof e === 'object' && 'status' in e) throw e; // re-throw SvelteKit errors
    throw error(500, 'Error al cargar el beat');
  }
};
