import { redirect } from '@sveltejs/kit';
import { getClientOrders } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  try {
    const orders = await getClientOrders(locals.user.uid);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { orders: orders as any };
  } catch {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { orders: [] as any };
  }
};
