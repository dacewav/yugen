import { getDrumkits } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    const kits = await getDrumkits();
    return { kits };
  } catch {
    return { kits: [] };
  }
};
