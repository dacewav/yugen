import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, setHeaders }) => {
  setHeaders({
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
  });

  // TODO: Query active members for nav
  // const members = await adminDb().collection('members')
  //   .where('isActive', '==', true)
  //   .select('id', 'slug', 'crewName', 'avatar', 'role', 'accentColor')
  //   .orderBy('joinedAt')
  //   .get();

  return {
    user: locals.user,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navMembers: [] as any[],
  };
};
