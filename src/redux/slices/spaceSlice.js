import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance, { unProtectedAxiosInstance } from '../../api/axiosInstance'

const initialState = {
  list: {spaces: []},
  selected: null,
  loading: false,
  updating: false,
  error: null,
}

export const fetchSpaces = createAsyncThunk('spaces/fetchAll', async (filters = {}) => {
  const query = new URLSearchParams()

  if (filters.search) query.append('search', filters.search)
  if (filters.city) query.append('city', filters.city)
  if (filters.state) query.append('state', filters.state)
  if (filters.spaceType && filters.spaceType !== 'all') query.append('spaceType', filters.spaceType)
  if (filters.capacity && filters.capacity !== 'any') query.append('capacity', filters.capacity)
  if (filters.minPrice != null) query.append('minPrice', filters.minPrice)
  if (filters.maxPrice != null) query.append('maxPrice', filters.maxPrice)
  if (filters.sort) query.append('sort', filters.sort)

  const res = await unProtectedAxiosInstance.get(`/spaces?${query.toString()}`)
  return res.data.spaces // or return res.data if you want pagination metadata too
})

// ---------- helpers ----------
/**
 * Recursively flattens a nested object/array into FormData keys
 *   price.amount  -> price[amount]
 *   location.city -> location[city]
 *   amenities[0]  -> amenities[0]
 */
const appendFormData = (formData, data, parentKey = '') => {
  if (data === undefined || data === null) return

  // Arrays
  if (Array.isArray(data) && !(data[0] instanceof File)) {
    data.forEach((value, idx) => {
      appendFormData(formData, value, `${parentKey}[${idx}]`)
    })
    return
  }

  // Files and primitives
  if (typeof data !== 'object' || data instanceof File) {
    formData.append(parentKey, data)
    return
  }

  // Nested objects
  Object.keys(data).forEach((key) => {
    const newKey = parentKey ? `${parentKey}[${key}]` : key
    appendFormData(formData, data[key], newKey)
  })
}

export const getSpace = createAsyncThunk('spaces/getById', async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/spaces/${id}`)
    return res.data.space
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const fetchMySpaces = createAsyncThunk(
  'spaces/fetchMySpaces',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/spaces/owner/my-spaces')
      return res.data // assume it's an array of spaces
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const postSpace = createAsyncThunk(
  'spaces/create',
  /**
   * @param {object} values  – Full Formik values { name, description, images, ... }
   * @param {*} thunkAPI
   */
  async (values, { rejectWithValue }) => {
    try {
      const formData = new FormData()

      // 1️⃣  Append image files
      if (values.images && values.images.length) {
        values.images.forEach((file) => formData.append('images', file))
      }

      // 2️⃣  Append everything else
      // eslint-disable-next-line no-unused-vars
      const { images, ...rest } = values
      appendFormData(formData, rest)

      const res = await axiosInstance.post('/spaces', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      return res.data // newly created space object
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const updateSpace = createAsyncThunk(
  'spaces/edit',
  /**
   * @param {object} values  – Full Formik values { name, description, images, ... }
   * @param {*} thunkAPI
   */
  async ({ values, id }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      if (values.newImages && values.newImages.length) {
        values.newImages.forEach((file) => formData.append('newImages', file))
      }
      // eslint-disable-next-line no-unused-vars
      const { newImages, ...rest } = values
      appendFormData(formData, rest)

      const res = await axiosInstance.patch(`/spaces/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      console.log(res, "resesese")
      return res.data // newly created space object
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)


export const deleteSpace = createAsyncThunk(
  'spaces/delete',
  /**
   * @param {string} spaceId – The ID of the space to delete
   * @param {*} thunkAPI
   */
  async (spaceId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/spaces/${spaceId}`)
      return res.data // success message or deleted space ID
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

const spaceSlice = createSlice({
  name: 'spaces',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpaces.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSpaces.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchSpaces.rejected, (state) => {
        state.loading = false
        state.error = 'Error loading spaces'
      })

      .addCase(postSpace.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(postSpace.fulfilled, (state, action) => {
        state.loading = false
        state.list.spaces.push(action.payload?.space) // add the new space
      })
      .addCase(postSpace.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Error creating space'
      })

      .addCase(getSpace.pending, (state) => {
        state.loading = true
        state.error = null
        state.selected = null
      })
      .addCase(getSpace.fulfilled, (state, action) => {
        state.loading = false
        state.selected = action.payload
      })
      .addCase(getSpace.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Error fetching space'
        state.selected = null
      })

      .addCase(fetchMySpaces.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMySpaces.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchMySpaces.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Error fetching your spaces'
      })

      .addCase(deleteSpace.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteSpace.fulfilled, (state, action) => {
        state.loading = false
        const deletedId = action.meta.arg // The space ID we passed
        state.list.spaces = state.list.spaces.filter((space) => space._id !== deletedId)
        state.list.count -= 1
      })
      .addCase(deleteSpace.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Error deleting space'
      })
      .addCase(updateSpace.pending, (state) => {
        state.updating = true
        state.error = null
      })
      .addCase(updateSpace.fulfilled, (state, action) => {
        state.updating = false
        const updatedSpace = action.payload
        // Update in list
        const index = state.list.spaces.findIndex(space => space._id === updatedSpace._id)
        if (index !== -1) {
          state.list.spaces[index] = updatedSpace
        }
        // Also update selected if it's the same space
        if (state.selected?._id === updatedSpace._id) {
          state.selected = updatedSpace
        }
      })
      .addCase(updateSpace.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload || 'Error updating space'
      })

  },
})
export const { storeSpaceData } = spaceSlice.actions

export default spaceSlice.reducer
