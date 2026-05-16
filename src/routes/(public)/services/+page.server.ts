import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // TODO: Query Firestore for active services
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { services: [] as any[] };
};
