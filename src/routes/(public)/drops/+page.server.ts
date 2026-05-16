import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // TODO: Query Firestore for published drops
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { drops: [] as any[] };
};
