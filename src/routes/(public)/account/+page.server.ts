import { redirect } from '@sveltejs/kit';
import { getClient } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  try {
    const client = await getClient(locals.user.uid);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { client: client as any };
  } catch {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { client: null as any };
  }
};
