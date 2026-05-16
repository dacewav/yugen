import type { Role } from '$types/member';
import { error, redirect } from '@sveltejs/kit';

const ROLE_HIERARCHY: Record<Role, number> = {
  owner: 5,
  admin: 4,
  editor: 3,
  member: 2,
  viewer: 1,
} as const;

export function requireRole(
  locals: App.Locals,
  minimum: Role
): NonNullable<App.Locals['user']> {
  if (!locals.user) {
    throw redirect(303, '/login');
  }
  if (ROLE_HIERARCHY[locals.user.role] < ROLE_HIERARCHY[minimum]) {
    throw error(403, 'No tienes permiso para acceder a esto.');
  }
  return locals.user;
}

export function requireAuth(locals: App.Locals): NonNullable<App.Locals['user']> {
  if (!locals.user) {
    throw redirect(303, '/login');
  }
  return locals.user;
}
