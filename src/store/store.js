import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import servicesReducer from './slices/servicesSlice';
import staffReducer from './slices/staffSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookingWizard: bookingReducer,
    services: servicesReducer,
    staff: staffReducer,
    appointments: appointmentsReducer,
    ui: uiReducer,
  },
});

export default store;
