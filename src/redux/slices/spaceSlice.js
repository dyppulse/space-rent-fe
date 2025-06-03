import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};

export const fetchSpaces = createAsyncThunk('spaces/fetchAll', async () => {
  const res = await axiosInstance.get('/spaces'); // uses baseURL
  return res.data;
});

// ---------- helpers ----------
/**
 * Recursively flattens a nested object/array into FormData keys
 *   price.amount  -> price[amount]
 *   location.city -> location[city]
 *   amenities[0]  -> amenities[0]
 */
const appendFormData = (formData, data, parentKey = '') => {
  if (data === undefined || data === null) return;

  // Arrays
  if (Array.isArray(data) && !(data[0] instanceof File)) {
    data.forEach((value, idx) => {
      appendFormData(formData, value, `${parentKey}[${idx}]`);
    });
    return;
  }

  // Files and primitives
  if (typeof data !== 'object' || data instanceof File) {
    formData.append(parentKey, data);
    return;
  }

  // Nested objects
  Object.keys(data).forEach((key) => {
    const newKey = parentKey ? `${parentKey}[${key}]` : key;
    appendFormData(formData, data[key], newKey);
  });
};

export const getSpace = createAsyncThunk(
  'spaces/getById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/spaces/${id}`);
      return res.data.space;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchMySpaces = createAsyncThunk(
  'spaces/fetchMySpaces',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/spaces/owner/my-spaces');
      return res.data; // assume it's an array of spaces
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const postSpace = createAsyncThunk(
  'spaces/create',
  /**
   * @param {object} values  – Full Formik values { name, description, images, ... }
   * @param {*} thunkAPI
   */
  async (values, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // 1️⃣  Append image files
      if (values.images && values.images.length) {
        values.images.forEach((file) => formData.append('images', file));
      }

      // 2️⃣  Append everything else
      // eslint-disable-next-line no-unused-vars
      const { images, ...rest } = values;
      appendFormData(formData, rest);
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1])
      }

      const res = await axiosInstance.post('/spaces', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return res.data; // newly created space object
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


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
      })

      .addCase(postSpace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postSpace.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload); // add the new space
      })
      .addCase(postSpace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error creating space';
      })

      .addCase(getSpace.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selected = null;
      })
      .addCase(getSpace.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(getSpace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching space';
        state.selected = null;
      })

      .addCase(fetchMySpaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySpaces.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMySpaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching your spaces';
      });
      
  },
});

export default spaceSlice.reducer;
