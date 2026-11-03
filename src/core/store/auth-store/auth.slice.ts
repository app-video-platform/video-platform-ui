import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  GoogleLoginRequest,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  User,
  UserRole,
} from 'core/api/models';
import {
  registerUser,
  verifyEmailApi,
  signInUser,
  googleAPI,
  getUserProfileAPI,
  logoutAPI,
  updateUserDetailsAPI,
  changeDevUserRoleAPI,
} from 'core/api/services';
import { extractErrorMessage } from '@shared/utils';
import { isAxiosError } from 'axios';

export type SessionStatus = 'resolving' | 'authenticated' | 'unauthenticated' | 'unavailable';

export interface AuthState {
  user: null | User;
  loading: boolean;
  error: string | null;
  isUserLoggedIn: boolean | null;
  sessionStatus?: SessionStatus;
  sessionVersion?: number;
  profileRequestId?: string;
  profileError?: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isUserLoggedIn: null,
  sessionStatus: 'resolving',
  sessionVersion: 0,
  profileError: null,
};

const beginSession = (state: AuthState, status: SessionStatus) => {
  state.sessionVersion = (state.sessionVersion ?? 0) + 1;
  state.sessionStatus = status;
  state.user = null;
  state.isUserLoggedIn = status === 'unauthenticated' ? false : null;
  state.profileRequestId = undefined;
  state.profileError = null;
};

const acceptUser = (state: AuthState, user: User, resolveSession = true) => {
  const roles = (value: User | null) => [...(value?.roles ?? [])].sort().join(',');
  if (state.user?.id !== user.id || roles(state.user) !== roles(user)) {
    state.sessionVersion = (state.sessionVersion ?? 0) + 1;
  }
  state.user = user;
  if (resolveSession) {
    state.sessionStatus = 'authenticated';
    state.isUserLoggedIn = true;
    state.profileError = null;
  }
};

// Registration thunk: returns a success message from the backend.
export const signupUser = createAsyncThunk<
  { response: string }, // Return type: success message
  RegisterRequest, // Argument type (user data)
  { rejectValue: string } // Error type
>('auth/signupUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await registerUser(userData);
    return { response }; // API returns a success message
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

// Verify email thunk: calls the verify endpoint with the token.
export const verifyEmail = createAsyncThunk<
  string,
  string,
  { rejectValue: string } // Error type
>('auth/verifyEmail', async (token: string, { rejectWithValue }) => {
  try {
    const response = await verifyEmailApi(token);
    return response.data; // API returns a success message
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

// Sign in thunk: returns the user info along with a token.
export const signinUser = createAsyncThunk<
  string, // Return type: user login response
  LoginRequest, // Argument type (user data)
  { rejectValue: string } // Error type
>('auth/signinUser', async (userData, { dispatch, getState, rejectWithValue }) => {
  const version = (getState() as { auth: AuthState }).auth.sessionVersion;
  try {
    const response = await signInUser(userData);
    if ((getState() as { auth: AuthState }).auth.sessionVersion !== version) {
      return rejectWithValue('Session changed');
    }
    if (response === 'Login successful') {
      dispatch(getUserProfile());
    }
    return response; // API returns user info with token
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const googleSignInUser = createAsyncThunk<
  string, // Return type: google login response
  GoogleLoginRequest, // Argument type (token)
  { rejectValue: string } // Error type
>('auth/googleSignInUser', async (idToken, { dispatch, getState, rejectWithValue }) => {
  const version = (getState() as { auth: AuthState }).auth.sessionVersion;
  try {
    const response = await googleAPI(idToken);
    if ((getState() as { auth: AuthState }).auth.sessionVersion !== version) {
      return rejectWithValue('Session changed');
    }
    if (!response) {
      // If response is null or falsy, reject with an error message.
      return rejectWithValue('Signin failed');
    }
    dispatch(getUserProfile());
    return response; // API returns user info with token
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const getUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: { message: string; status?: number } }
>('auth/getUserProfile', async (_, { rejectWithValue }) => {
  try {
    return await getUserProfileAPI();
  } catch (error: unknown) {
    return rejectWithValue({
      message: extractErrorMessage(error),
      status: isAxiosError(error) ? error.response?.status : undefined,
    });
  }
});

export const logoutUser = createAsyncThunk<
  void, // Return type
  void, // Argument type
  { rejectValue: string } // Error type
>('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    // Assuming httpClient is your axios instance configured to include credentials.
    await logoutAPI();
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const updateUserDetails = createAsyncThunk<
  User, // Return type: user login response
  UpdateUserRequest, // Argument type (user data)
  { rejectValue: string } // Error type
>('auth/updateUserDetails', async (userData, { rejectWithValue }) => {
  try {
    const response = await updateUserDetailsAPI(userData);
    return response; // API returns user info with token
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const changeDevUserRole = createAsyncThunk<
  User,
  UserRole,
  { rejectValue: string }
>('auth/changeDevUserRole', async (role, { rejectWithValue }) => {
  try {
    return await changeDevUserRoleAPI(role);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // This action can be used to rehydrate the token on app load
    // setToken: (state, action: PayloadAction<string>) => {
    //   state.token = action.payload;
    // },
    setUserProfile: (state, action: PayloadAction<User>) => {
      acceptUser(state, action.payload);
    },
    sessionExpired: (state) => {
      beginSession(state, 'unauthenticated');
      state.loading = false;
    },
    sessionUnavailable: (state) => {
      state.sessionStatus = 'unavailable';
      state.isUserLoggedIn = null;
      state.profileError = 'Your session could not be verified. Please retry.';
      state.loading = false;
    },
    logout: (state) => {
      beginSession(state, 'unauthenticated');
      state.loading = false;
    },
    resetOnboarding: (state) => {
      // Reset any onboarding state if needed
      // This can be expanded based on your onboarding logic
      if (state.user) {
        state.user.onboardingCompleted = false;
      }

      state.isUserLoggedIn = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Registration cases:
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Signup failed';
      })
      // Verification cases:
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Verification failed';
      })
      // Sign in cases:
      .addCase(signinUser.pending, (state) => {
        beginSession(state, 'resolving');
        state.loading = true;
        state.error = null;
      })
      .addCase(signinUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signinUser.rejected, (state, action) => {
        beginSession(state, 'unauthenticated');
        state.loading = false;
        state.error = action.payload || 'Signin failed';
      })
      // Google Sign In
      .addCase(googleSignInUser.pending, (state) => {
        beginSession(state, 'resolving');
        state.loading = true;
        state.error = null;
      })
      .addCase(googleSignInUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(googleSignInUser.rejected, (state, action) => {
        beginSession(state, 'unauthenticated');
        state.loading = false;
        state.error = action.payload || 'Google Signin failed';
      })
      // Profile resolution is independent from profile mutation loading.
      .addCase(getUserProfile.pending, (state, action) => {
        state.loading = true;
        state.sessionStatus = 'resolving';
        state.isUserLoggedIn = null;
        state.profileRequestId = action.meta.requestId;
        state.profileError = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        if (state.profileRequestId !== action.meta.requestId) {
          return;
        }
        state.loading = false;
        state.profileRequestId = undefined;
        acceptUser(state, action.payload);
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        if (state.profileRequestId !== action.meta.requestId) {
          return;
        }
        state.loading = false;
        state.profileRequestId = undefined;
        if (action.payload?.status === 401 || action.payload?.status === 403) {
          beginSession(state, 'unauthenticated');
        } else {
          state.sessionStatus = 'unavailable';
          state.isUserLoggedIn = null;
          state.profileError = 'Your session could not be verified. Please retry.';
        }
      })
      .addCase(logoutUser.pending, (state) => {
        beginSession(state, 'unauthenticated');
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.sessionStatus = 'unauthenticated';
        state.isUserLoggedIn = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Optionally handle logout errors here.
        state.error = action.payload || 'Logout failed';
      })

      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateUserDetails.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          acceptUser(state, action.payload, state.sessionStatus === 'authenticated');
        },
      )
      .addCase(updateUserDetails.rejected, (state) => {
        state.loading = false;
        state.error = 'Update user details failed';
      })
      .addCase(changeDevUserRole.pending, (state) => {
        state.sessionVersion = (state.sessionVersion ?? 0) + 1;
        state.sessionStatus = 'resolving';
        state.isUserLoggedIn = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(
        changeDevUserRole.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          acceptUser(state, action.payload);
        },
      )
      .addCase(changeDevUserRole.rejected, (state, action) => {
        state.loading = false;
        state.sessionStatus = state.user ? 'authenticated' : 'unauthenticated';
        state.isUserLoggedIn = Boolean(state.user);
        state.error = action.payload || 'Change dev user role failed';
      });
  },
});

export const { logout, setUserProfile, resetOnboarding, sessionExpired, sessionUnavailable } = authSlice.actions;
export default authSlice.reducer;
