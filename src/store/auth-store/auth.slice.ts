import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  googleAPI,
  logoutAPI,
  registerUser,
  signInUser,
  verifyEmailApi,
} from '../../api/services/auth/auth-api';
import { getUserProfileAPI } from '../../api/services/user/user-api';

import { SignInFormData } from '../../pages/sign-in/sign-in.component';
import { User, UserRegisterData } from '../../api/models/user/user';
import { INotification } from '../../api/models/user/notification';

interface AuthState {
  user: null | User;
  loading: boolean;
  error: string | null;
  message: string | null;
  isUserLoggedIn: boolean | null;
  notifications: INotification[];
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  message: null,
  isUserLoggedIn: null,
  notifications: [],
};

// Registration thunk: returns a success message from the backend.
export const signupUser = createAsyncThunk<
  { response: string }, // Return type: success message
  UserRegisterData, // Argument type (user data)
  { rejectValue: string } // Error type
>('auth/signupUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await registerUser(userData);
    return { response }; // API returns a success message
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Signup failed');
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
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Verification failed');
  }
});

// Sign in thunk: returns the user info along with a token.
export const signinUser = createAsyncThunk<
  string, // Return type: user login response
  SignInFormData, // Argument type (user data)
  { rejectValue: string } // Error type
>('auth/signinUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await signInUser(userData);
    return response; // API returns user info with token
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Signin failed');
  }
});

export const googleSignInUser = createAsyncThunk<
  string, // Return type: google login response
  string, // Argument type (token)
  { rejectValue: string } // Error type
>('auth/googleSignInUser', async (idToken, { rejectWithValue }) => {
  try {
    const response = await googleAPI(idToken);
    if (!response) {
      // If response is null or falsy, reject with an error message.
      return rejectWithValue('Signin failed');
    }
    return response; // API returns user info with token
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Signin failed');
  }
});

export const getUserProfile = createAsyncThunk<
  User, // Return type: user login response
  void, // Argument type (user data)
  { rejectValue: string } // Error type
>('auth/getUserProfile', async (any, { rejectWithValue }) => {
  try {
    const response = await getUserProfileAPI();
    return response; // API returns user info with token
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Retrieving user profile failed'
    );
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
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Logout failed');
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
      state.message = null;
    },
    // Optional: reset the message state after it has been shown
    resetMessage: (state) => {
      state.message = null;
    },

    addNotification: (state, action: PayloadAction<INotification>) => {
      state.notifications.push(action.payload);
    },
    markNotificationAsRead: (state, action: PayloadAction<INotification>) => {
      const foundNotification = state.notifications.find(
        (notif) => notif.id === action.payload.id
      );
      if (foundNotification) {
        foundNotification.isRead = true;
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
      .addCase(
        signupUser.fulfilled,
        (state, action: PayloadAction<{ response: string }>) => {
          state.loading = false;
          // Instead of updating user/token, we store the success message.
          state.message = action.payload.response;
        }
      )
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Signup failed';
      })
      // Verification cases:
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        verifyEmail.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          // You could optionally store the verification success message
          state.message = action.payload;
        }
      )
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Verification failed';
      })
      // Sign in cases:
      .addCase(signinUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        // console.log('in case', action.payload);

        if (action.payload === 'Login successful') {
          state.isUserLoggedIn = true;
        }
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
      .addCase(
        googleSignInUser.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          // console.log('in case', action.payload);

          state.isUserLoggedIn = true;
          // if (action.payload === 'Login successful') {
          //   state.isUserLoggedIn = true;
          // }
        }
      )
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
        }
      )
      .addCase(getUserProfile.rejected, (state) => {
        state.loading = false;
        state.error = 'Get User Profile failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isUserLoggedIn = null;
        state.message = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Optionally handle logout errors here.
        state.error = action.payload || 'Logout failed';
      });
  },
});

export const {
  logout,
  resetMessage,
  setUserProfile,
  addNotification,
  // markNotificationAsRead,
} = authSlice.actions;
export default authSlice.reducer;
