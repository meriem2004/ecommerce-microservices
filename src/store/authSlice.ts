// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';
import * as authService from '../services/auth';
import { STORAGE_KEYS } from '../config';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: authService.getCurrentUser(),
  token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      console.log('Auth slice: Attempting login...');
      const response = await authService.login(credentials);
      console.log('Auth slice: Login successful, returning user data');
      return response;
    } catch (error: any) {
      console.error('Auth slice: Login failed:', error);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      console.log('Auth slice: Attempting registration...');
      const response = await authService.register(userData);
      console.log('Auth slice: Registration successful, returning user data');
      return response;
    } catch (error: any) {
      console.error('Auth slice: Registration failed:', error);
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const refreshAuthToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Auth slice: Refreshing token...');
      const newToken = await authService.refreshToken();
      if (!newToken) {
        throw new Error('Token refresh failed');
      }
      console.log('Auth slice: Token refresh successful');
      return newToken;
    } catch (error: any) {
      console.error('Auth slice: Token refresh failed:', error);
      return rejectWithValue('Token refresh failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  console.log('Auth slice: Logging out user, clearing data');
  authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Add a manual authentication update function
    updateAuthState: (state) => {
      state.user = authService.getCurrentUser();
      state.token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      state.isAuthenticated = authService.isAuthenticated();
      console.log('Auth slice: Manually updated auth state:', { 
        hasUser: !!state.user, 
        hasToken: !!state.token, 
        isAuthenticated: state.isAuthenticated 
      });
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        
        // Note: Token and user are already stored in localStorage by the auth service
        console.log('Auth slice: User data stored in Redux state. Auth state:', { 
          isAuthenticated: state.isAuthenticated,
          hasToken: !!state.token,
          hasUser: !!state.user
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        console.log('Auth slice: Login rejected, auth state reset');
      })
      
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        
        // Note: Token and user are already stored in localStorage by the auth service
        console.log('Auth slice: User data stored in Redux state. Auth state:', { 
          isAuthenticated: state.isAuthenticated,
          hasToken: !!state.token,
          hasUser: !!state.user
        });
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        console.log('Auth slice: Registration rejected, auth state reset');
      })
      
      // Refresh token cases
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuthenticated = true;
        console.log('Auth slice: Token refresh successful in state');
      })
      .addCase(refreshAuthToken.rejected, (state) => {
        // If token refresh fails, logout
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        console.log('Auth slice: Token refresh failed, auth state reset');
      })
      
      // Logout case
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        console.log('Auth slice: Logout successful, auth state reset');
      });
  },
});

export const { clearError, updateAuthState } = authSlice.actions;
export default authSlice.reducer;