// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as authService from '../services/auth';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';
import { STORAGE_KEYS } from '../config';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    authService.logout();
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateAuthState: (state) => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        
        if (token && userData) {
          state.token = token;
          state.user = JSON.parse(userData);
          state.isAuthenticated = true;
          console.log('Auth state updated from localStorage:', {
            hasToken: !!token,
            user: state.user?.email
          });
        } else {
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
        }
      } catch (error) {
        console.error('Error updating auth state:', error);
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      }
    },
    syncAuthFromStorage: (state) => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        
        if (token && userData) {
          const user = JSON.parse(userData);
          state.token = token;
          state.user = user;
          state.isAuthenticated = true;
          state.loading = false;
          state.error = null;
          
          console.log('Auth synced from localStorage:', {
            userId: user.id,
            email: user.email,
            isAuthenticated: true
          });
        } else {
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
          state.loading = false;
        }
      } catch (error) {
        console.error('Error syncing auth from storage:', error);
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = 'Authentication sync failed';
      }
    },
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        console.log('Login fulfilled in store:', action.payload.user?.email);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        console.log('Registration fulfilled in store:', action.payload.user?.email);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        console.log('Logout fulfilled in store');
      });
  },
});

export const { 
  clearError, 
  updateAuthState, 
  syncAuthFromStorage, 
  resetAuth 
} = authSlice.actions;

export default authSlice.reducer;