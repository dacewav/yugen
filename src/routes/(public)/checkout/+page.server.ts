import { error } from '@sveltejs/kit';
import { getBeatBySlug, getDrumkitBySlug, getServiceBySlug } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const type = url.searchParams.get('type') as 'beat' | 'drumkit' | 'service' | null;
  const id = url.searchParams.get('id');
  const tier = url.searchParams.get('tier') ?? undefined;

  if (!type || !id) {
    throw error(400, 'Falta el producto o tipo');
  }

  try {
    let product = null;

    if (type === 'beat') {
      product = await getBeatBySlug(id);
    } else if (type === 'drumkit') {
      product = await getDrumkitBySlug(id);
    } else if (type === 'service') {
      product = await getServiceBySlug(id);
    }

    if (!product) {
      throw error(404, 'Producto no encontrado');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { product: product as any, type, tier };
  } catch (e) {
    if (e && typeof e === 'object' && 'status' in e) throw e;
    throw error(500, 'Error al cargar el producto');
  }
};
