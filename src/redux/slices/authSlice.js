import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { unProtectedAxiosInstance } from '../../api/axiosInstance';
import axios from 'axios';

const initialState = {
  user: null,
  loading: false,
  error: null,
  signUpError: null
};

export const login = createAsyncThunk(
  'auth/login',

  async ({ email, password }, { rejectWithValue }) => {

    try {
      const response = await unProtectedAxiosInstance.post('/auth/login', {
        email,
        password,
      });
      localStorage.setItem("token", response?.data?.token)
      return response.data;
    } catch (err) {
      // debugger
      const message =
        err.response?.data?.message || err.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const signUp = createAsyncThunk(
  "SIGN_UP",
  async ({ name, email, password, phone }, { rejectWithValue }) => {
    try {
      const response = await unProtectedAxiosInstance.post("/auth/register", {
        name,
        email,
        password,
        phone
      })
      localStorage.setItem("token", response?.data?.token)
      return response.data;

    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = {}
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.signUpError = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false,
          state.signUpError = null,
          state.user = action.payload
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
