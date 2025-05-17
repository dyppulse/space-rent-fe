import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchSpaces = createAsyncThunk('spaces/fetchAll', async () => {
  const res = await axiosInstance.get('/spaces'); // uses baseURL
  return res.data;
});

const spaceSlice = createSlice({
  name: 'spaces',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpaces.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSpaces.rejected, (state) => {
        state.loading = false;
        state.error = 'Error loading spaces';
      });
  },
});

export default spaceSlice.reducer;
