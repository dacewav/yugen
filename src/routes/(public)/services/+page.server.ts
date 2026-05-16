import { getServices } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    const services = await getServices();
    return { services };
  } catch {
    return { services: [] };
  }
};
