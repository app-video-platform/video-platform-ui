import { UserRole } from './user';

export const rolePrecedence: UserRole[] = [
  UserRole.ADMIN,
  UserRole.CREATOR,
  UserRole.USER,
];

export const hasRole = (
  roles: UserRole[] | undefined | null,
  role: UserRole,
) => Boolean(roles?.includes(role));

export const hasAnyRole = (
  roles: UserRole[] | undefined | null,
  allowedRoles: UserRole[],
) => Boolean(roles?.some((role) => allowedRoles.includes(role)));

export const isCreatorOrAdmin = (roles: UserRole[] | undefined | null) =>
  hasAnyRole(roles, [UserRole.CREATOR, UserRole.ADMIN]);

export const getPrimaryRole = (roles: UserRole[] | undefined | null) =>
  rolePrecedence.find((role) => roles?.includes(role)) ?? UserRole.USER;
