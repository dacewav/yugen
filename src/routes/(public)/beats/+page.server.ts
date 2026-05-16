import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // TODO: Query Firestore for published beats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { beats: [] as any[] };
};
