import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  GoogleLoginRequest,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  User,
  UserRole,
} from '@api/models';
import {
  registerUser,
  verifyEmailApi,
  signInUser,
  googleAPI,
  getUserProfileAPI,
  logoutAPI,
  updateUserDetailsAPI,
} from '@api/services';
import { extractErrorMessage } from '@shared/utils';

interface AuthState {
  user: null | User;
  loading: boolean;
  error: string | null;
  isUserLoggedIn: boolean | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isUserLoggedIn: null,
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
>('auth/signinUser', async (userData, { dispatch, rejectWithValue }) => {
  try {
    const response = await signInUser(userData);
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
>('auth/googleSignInUser', async (idToken, { dispatch, rejectWithValue }) => {
  try {
    const response = await googleAPI(idToken);
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
  User, // Return type: user login response
  void, // Argument type (user data)
  { rejectValue: string } // Error type
>('auth/getUserProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await getUserProfileAPI();
    return response; // API returns user info with token
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // This action can be used to rehydrate the token on app load
    // setToken: (state, action: PayloadAction<string>) => {
    //   state.token = action.payload;
    // },
    setUserProfile: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isUserLoggedIn = null;
    },
    resetOnboarding: (state) => {
      // Reset any onboarding state if needed
      // This can be expanded based on your onboarding logic
      if (state.user) {
        state.user.onboardingCompleted = false;
      }

      state.isUserLoggedIn = true;
    },

    changeUserRole: (state, action: PayloadAction<UserRole>) => {
      if (state.user) {
        state.user.roles = [action.payload];
      }
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
        state.loading = true;
        state.error = null;
      })
      .addCase(signinUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Signin failed';
      })
      // Google Sign In
      .addCase(googleSignInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleSignInUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(googleSignInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Google Signin failed';
      })
      // Get User Profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
          state.isUserLoggedIn = true;
        },
      )
      .addCase(getUserProfile.rejected, (state) => {
        state.loading = false;
        state.isUserLoggedIn = false;
        state.error = 'Get User Profile failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isUserLoggedIn = null;
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
          state.user = action.payload;
        },
      )
      .addCase(updateUserDetails.rejected, (state) => {
        state.loading = false;
        state.error = 'Update user details failed';
      });
  },
});

export const { logout, setUserProfile, resetOnboarding, changeUserRole } =
  authSlice.actions;
export default authSlice.reducer;
