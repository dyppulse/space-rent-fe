import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { unProtectedAxiosInstance } from '../../api/axiosInstance'

const initialState = {
  user: null,
  loading: false,
  error: null,
  signUpError: null,
  initialized: false, // Track if auth state has been initialized
}

export const login = createAsyncThunk(
  'auth/login',

  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await unProtectedAxiosInstance.post('/auth/login', {
        email,
        password,
      })
      return response.data
    } catch (err) {
      // debugger
      const message = err.response?.data?.message || err.message || 'Login failed'
      return rejectWithValue(message)
    }
  }
)

export const signUp = createAsyncThunk(
  'SIGN_UP',
  async ({ name, email, password, phone }, { rejectWithValue }) => {
    try {
      const response = await unProtectedAxiosInstance.post('/auth/register', {
        name,
        email,
        password,
        phone,
      })
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed'
      return rejectWithValue(message)
    }
  }
)

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',

  async (_, { rejectWithValue }) => {
    try {
      const response = await unProtectedAxiosInstance.get('/auth/me')
      return response.data
    } catch (err) {
      // If it's a 401 (no token), that's expected for non-logged-in users
      // If it's any other error, log it but don't treat as auth failure
      if (err.response?.status === 401) {
        console.log('Auth check: No valid token found (user not logged in)')
      } else {
        console.log('Auth check: Unexpected error:', err.message)
      }
      // Don't throw error for auth check - just return null
      return rejectWithValue(null)
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await unProtectedAxiosInstance.post('/auth/logout')
    return null
  } catch (err) {
    console.log('Logout error:', err)
    // Even if logout API fails, we should still logout locally
    return null
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.loading = false
      state.error = null
      state.signUpError = null
      state.initialized = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
        state.initialized = false
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.error = null
        state.initialized = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.user = null
        state.initialized = true
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true
        state.signUpError = null
        state.initialized = false
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false
        state.signUpError = null
        state.user = action.payload.user
        state.initialized = true
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true
        state.initialized = false
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.initialized = true
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false
        state.user = null
        state.initialized = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.loading = false
        state.error = null
        state.signUpError = null
        state.initialized = true
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
