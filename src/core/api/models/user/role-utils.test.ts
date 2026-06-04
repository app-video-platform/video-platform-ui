import {
  getPrimaryRole,
  hasAnyRole,
  hasRole,
  isCreatorOrAdmin,
  UserRole,
} from 'core/api/models';

describe('role utils', () => {
  it('uses admin, creator, user precedence for primary role', () => {
    expect(
      getPrimaryRole([UserRole.USER, UserRole.CREATOR, UserRole.ADMIN]),
    ).toBe(UserRole.ADMIN);
    expect(getPrimaryRole([UserRole.USER, UserRole.CREATOR])).toBe(
      UserRole.CREATOR,
    );
    expect(getPrimaryRole([UserRole.USER])).toBe(UserRole.USER);
  });

  it('checks exact and any-role matches', () => {
    expect(hasRole([UserRole.USER], UserRole.USER)).toBe(true);
    expect(hasRole([UserRole.USER], UserRole.CREATOR)).toBe(false);
    expect(hasAnyRole([UserRole.CREATOR], [UserRole.ADMIN, UserRole.CREATOR]))
      .toBe(true);
    expect(hasAnyRole([UserRole.USER], [UserRole.ADMIN, UserRole.CREATOR]))
      .toBe(false);
  });

  it('treats admin and creator as creator-area roles', () => {
    expect(isCreatorOrAdmin([UserRole.ADMIN])).toBe(true);
    expect(isCreatorOrAdmin([UserRole.CREATOR])).toBe(true);
    expect(isCreatorOrAdmin([UserRole.USER])).toBe(false);
  });
});
