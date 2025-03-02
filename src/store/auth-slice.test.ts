// auth.slice.test.ts
import authReducer, {
  logout,
  resetMessage,
  setToken,
  setUserProfile,
  signupUser,
  verifyEmail,
  signinUser,
} from './auth.slice';
import { User, UserLoginResponse } from '../models/user';

// Define an initial state matching your AuthState interface
const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  message: null,
};

describe('auth slice reducers', () => {
  it('should handle setToken', () => {
    const state = authReducer(initialState, setToken('abc123'));
    expect(state.token).toBe('abc123');
  });

  it('should handle setUserProfile', () => {
    const user = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      role: ['user'],
    } as User;
    const state = authReducer(initialState, setUserProfile(user));
    expect(state.user).toEqual(user);
  });

  it('should handle logout', () => {
    const modifiedState = {
      ...initialState,
      user: { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', role: ['user'] },
      token: 'abc123',
      message: 'some message',
    };
    const state = authReducer(modifiedState, logout());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.message).toBeNull();
  });

  it('should handle resetMessage', () => {
    const modifiedState = { ...initialState, message: 'test message' };
    const state = authReducer(modifiedState, resetMessage());
    expect(state.message).toBeNull();
  });
});

describe('auth slice async thunks', () => {
  // Simulate the fulfilled state for signupUser
  it('should handle signupUser.fulfilled', () => {
    const action = {
      type: signupUser.fulfilled.type,
      payload: { response: 'Registration successful' },
    };
    const state = authReducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.message).toBe('Registration successful');
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
    expect(state.message).toBe('Verification successful');
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
    const fakeResponse: UserLoginResponse = {
      token: 'abc123',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      role: ['user'],
    };
    const action = {
      type: signinUser.fulfilled.type,
      payload: fakeResponse,
    };
    const state = authReducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.token).toBe(fakeResponse.token);
    expect(state.user).toEqual({
      firstName: fakeResponse.firstName,
      lastName: fakeResponse.lastName,
      email: fakeResponse.email,
      role: fakeResponse.role,
    });
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
});
