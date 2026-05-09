import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

// Load user from token
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getMe();
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      return rejectWithValue(error.response?.data?.message || 'Session expired');
    }
  }
);

// Customer send OTP
export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authAPI.sendOTP(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

// Customer verify OTP & signup
export const customerSignup = createAsyncThunk(
  'auth/customerSignup',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyOTP(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

// Customer Login
export const customerLogin = createAsyncThunk(
  'auth/customerLogin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.customerLogin(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Vendor Signup
export const vendorSignup = createAsyncThunk(
  'auth/vendorSignup',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authAPI.vendorSignup(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

// Vendor Login
export const vendorLogin = createAsyncThunk(
  'auth/vendorLogin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.vendorLogin(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const initialState = {
  user: null,
  role: localStorage.getItem('role') || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  isLoading: !!localStorage.getItem('token'),
  otpSent: false,
  otpLoading: false,
  loginLoading: false,
  signupLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      toast.success('Logged out successfully');
    },
    clearError: (state) => {
      state.error = null;
    },
    resetOTPState: (state) => {
      state.otpSent = false;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    // Load User
    builder
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.role;
      })
      .addCase(loadUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.role = null;
      });

    // Send OTP
    builder
      .addCase(sendOTP.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.otpLoading = false;
        state.otpSent = true;
        toast.success(action.payload.message);
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // Customer Signup
    builder
      .addCase(customerSignup.pending, (state) => {
        state.signupLoading = true;
      })
      .addCase(customerSignup.fulfilled, (state, action) => {
        state.signupLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', action.payload.role);
        toast.success(action.payload.message);
      })
      .addCase(customerSignup.rejected, (state, action) => {
        state.signupLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // Customer Login
    builder
      .addCase(customerLogin.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(customerLogin.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', action.payload.role);
        toast.success(action.payload.message);
      })
      .addCase(customerLogin.rejected, (state, action) => {
        state.loginLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // Vendor Signup
    builder
      .addCase(vendorSignup.pending, (state) => {
        state.signupLoading = true;
      })
      .addCase(vendorSignup.fulfilled, (state, action) => {
        state.signupLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', action.payload.role);
        toast.success(action.payload.message);
      })
      .addCase(vendorSignup.rejected, (state, action) => {
        state.signupLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // Vendor Login
    builder
      .addCase(vendorLogin.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(vendorLogin.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', action.payload.role);
        toast.success(action.payload.message);
      })
      .addCase(vendorLogin.rejected, (state, action) => {
        state.loginLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  }
});

export const { logout, clearError, resetOTPState, updateUser } = authSlice.actions;
export default authSlice.reducer;
