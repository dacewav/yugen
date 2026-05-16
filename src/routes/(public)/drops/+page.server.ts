import { getDrops } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    const drops = await getDrops();
    return { drops };
  } catch {
    return { drops: [] };
  }
};
