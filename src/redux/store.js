import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import spaceReducer from './slices/spaceSlice';
import bookingReducer from './slices/bookingSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    spaces: spaceReducer,
    bookings: bookingReducer,
  },
});

export default store;
