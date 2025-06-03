import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance, { unProtectedAxiosInstance} from '../../api/axiosInstance';

const initialState = {
  list: [],
  selected: null,
  stats: null,
  loading: false,
  error: null,
};

// 🔄 Create booking
export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const res = await unProtectedAxiosInstance.post('/bookings', bookingData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 👤 Owner bookings
export const fetchOwnerBookings = createAsyncThunk(
  'bookings/fetchOwner',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/bookings/owner');
      return res.data.bookings;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📊 Booking stats
export const fetchBookingStats = createAsyncThunk(
  'bookings/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/bookings/stats');
      return res.data.stats;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔍 Get one booking
export const getBooking = createAsyncThunk(
  'bookings/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/bookings/${id}`);
      return res.data.booking;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✏️ Update booking status
export const updateBookingStatus = createAsyncThunk(
  'bookings/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      console.log(id, status, 'jdjkskd')
      const res = await axiosInstance.patch(`/bookings/${id}/status`, { status });
      return res.data.updatedBooking;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchOwnerBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchOwnerBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchBookingStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      .addCase(getBooking.fulfilled, (state, action) => {
        state.selected = action.payload;
      })

      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error updating booking status';
      })

      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
      
        const updated = action.payload;
        console.log(updated, 'updated')
      
        const index = state.list.findIndex((b) => b._id === updated._id);
        console.log(index, 'index')
        if (index !== -1) {
          state.list[index] = updated;
        }
      });
      
  },
});

export default bookingSlice.reducer;
