import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetchAppointments, apiCreateAppointment, apiUpdateAppointment } from '../../api/mockApi';

export const fetchAppointments = createAsyncThunk('appointments/fetch', async () =>
  apiFetchAppointments()
);
export const createAppointment = createAsyncThunk('appointments/create', async (appt) =>
  apiCreateAppointment(appt)
);
export const updateAppointment = createAsyncThunk('appointments/update', async ({ id, changes }) =>
  apiUpdateAppointment(id, changes)
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const idx = state.items.findIndex((a) => a.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      });
  },
});

export default appointmentsSlice.reducer;
