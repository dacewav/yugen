import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // TODO: Query Firestore for beat by slug
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { beat: null as any };
};
