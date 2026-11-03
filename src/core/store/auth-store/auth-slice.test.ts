// auth.slice.test.ts
import { User, UserRole } from 'core/api/models';
import authReducer, {
  logout,
  setUserProfile,
  signupUser,
  verifyEmail,
  signinUser,
  changeDevUserRole,
  updateUserDetails,
} from './auth.slice';

// Define an initial state matching your AuthState interface
const initialState = {
  user: null,
  loading: false,
  error: null,
  isUserLoggedIn: null,
};

describe('auth slice reducers', () => {
  it('should handle setUserProfile', () => {
    const user = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      roles: [UserRole.USER],
      onboardingCompleted: true,
    } as User;
    const state = authReducer(initialState, setUserProfile(user));
    expect(state.user).toEqual(user);
  });

  it('should handle logout', () => {
    const modifiedState = {
      ...initialState,
      user: {
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        roles: [UserRole.USER],
      },
      token: 'abc123',
      message: 'some message',
    };
    const state = authReducer(modifiedState, logout());
    expect(state.user).toBeNull();
  });
});

describe('auth slice async thunks', () => {
  it('keeps only the newest profile mutation result and leaves auth errors independent', () => {
    const user = {
      id: 'u1', firstName: 'New', lastName: 'Name', email: 'u@example.test',
      roles: [UserRole.CREATOR],
    } as User;
    const pending1 = updateUserDetails.pending('r1', { firstName: 'First' });
    const pending2 = updateUserDetails.pending('r2', { firstName: 'Newest' });
    let state = authReducer({
      ...initialState,
      user: { ...user, firstName: 'Old' },
      sessionStatus: 'authenticated',
      error: 'Unrelated authentication error',
    }, pending1);
    state = authReducer(state, pending2);
    state = authReducer(state, updateUserDetails.fulfilled(user, 'r1', { firstName: 'First' }));
    expect(state.user?.firstName).toBe('Old');
    state = authReducer(state, updateUserDetails.rejected(null, 'r1', { firstName: 'First' }, 'stale failure'));
    expect(state.profileUpdateError).toBeNull();
    state = authReducer(state, updateUserDetails.fulfilled(user, 'r2', { firstName: 'Newest' }));
    expect(state.user?.firstName).toBe('New');
    expect(state.profileUpdateLoading).toBe(false);
    expect(state.error).toBe('Unrelated authentication error');
  });
  // Simulate the fulfilled state for signupUser
  it('should handle signupUser.fulfilled', () => {
    const action = {
      type: signupUser.fulfilled.type,
      payload: { response: 'Registration successful' },
    };
    const state = authReducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  // Simulate the rejected state for signupUser
  it('should handle signupUser.rejected', () => {
    const action = {
      type: signupUser.rejected.type,
      payload: 'Signup failed',
    };
    const state = authReducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Signup failed');
  });

  // Simulate the fulfilled state for verifyEmail
  it('should handle verifyEmail.fulfilled', () => {
    const action = {
      type: verifyEmail.fulfilled.type,
      payload: 'Verification successful',
    };
    const state = authReducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
  });

  // Simulate the rejected state for verifyEmail
  it('should handle verifyEmail.rejected', () => {
    const action = {
      type: verifyEmail.rejected.type,
      payload: 'Verification failed',
    };
    const state = authReducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Verification failed');
  });

  // Simulate the fulfilled state for signinUser
  it('should handle signinUser.fulfilled', () => {
    const fakeResponse = 'Login successful';
    const action = {
      type: signinUser.fulfilled.type,
      payload: fakeResponse,
    };
    const state = authReducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
  });

  // Simulate the rejected state for signinUser
  it('should handle signinUser.rejected', () => {
    const action = {
      type: signinUser.rejected.type,
      payload: 'Signin failed',
    };
    const state = authReducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Signin failed');
  });

  it('should handle changeDevUserRole.fulfilled', () => {
    const user = {
      firstName: 'Alice',
      lastName: 'Creator',
      email: 'alice@example.com',
      roles: [UserRole.CREATOR],
    } as User;

    const action = {
      type: changeDevUserRole.fulfilled.type,
      payload: user,
    };

    const state = authReducer({ ...initialState, loading: true }, action);

    expect(state.loading).toBe(false);
    expect(state.user).toEqual(user);
    expect(state.isUserLoggedIn).toBe(true);
  });
});
