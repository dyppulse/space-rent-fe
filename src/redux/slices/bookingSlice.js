import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
  status: 'idle', // 'loading', 'success', 'error'
};

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/bookings', formData);
      return res.data; // Axios puts parsed JSON here
    } catch (err) {
      // Forward a readable message to the rejected action
      return rejectWithValue(err.response?.data?.message || 'Booking failed');
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
        state.status = 'loading';
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(createBooking.rejected, (state) => {
        state.status = 'error';
      });
  },
});

export default bookingSlice.reducer;
