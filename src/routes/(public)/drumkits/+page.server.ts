import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // TODO: Query Firestore for published drumkits
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { kits: [] as any[] };
};
