import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserLoginResponse, UserRegisterData } from '../models/user';
import { registerUser, signInUser, verifyEmailApi } from '../api/user-api';
import { SignInFormData } from '../pages/sign-in/sign-in.component';

interface AuthState {
  user: null | User;
  token: string | null;
  loading: boolean;
  error: string | null;
  // Optional: you might want to store a message (for registration/verification status)
  message: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  message: null,
};

// Registration thunk: returns a success message from the backend.
export const signupUser = createAsyncThunk<
  { response: string }, // Return type: success message
  UserRegisterData,     // Argument type (user data)
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
  string,  // Return type: success message
  string,  // Argument type: token
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
  UserLoginResponse,  // Return type: user login response
  SignInFormData,     // Argument type (user data)
  { rejectValue: string } // Error type
>('auth/signinUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await signInUser(userData);
    return response; // API returns user info with token
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Signin failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.message = null;
    },
    // Optional: reset the message state after it has been shown
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Registration cases:
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<{ response: string }>) => {
        state.loading = false;
        // Instead of updating user/token, we store the success message.
        state.message = action.payload.response;
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
      .addCase(verifyEmail.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        // You could optionally store the verification success message
        state.message = action.payload;
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
      .addCase(signinUser.fulfilled, (state, action: PayloadAction<UserLoginResponse>) => {
        state.loading = false;
        state.user = {
          // id: action.payload.id,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email,
          role: action.payload.role,
        };
        state.token = action.payload.token;
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Signin failed';
      });
  },
});

export const { logout, resetMessage } = authSlice.actions;
export default authSlice.reducer;
