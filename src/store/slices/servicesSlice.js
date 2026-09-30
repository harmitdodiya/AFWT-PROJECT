import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetchServices, apiSaveService, apiDeleteService } from '../../api/mockApi';

export const fetchServices = createAsyncThunk('services/fetch', async () => apiFetchServices());
export const saveService = createAsyncThunk('services/save', async (service) => apiSaveService(service));
export const deleteService = createAsyncThunk('services/delete', async (id) => apiDeleteService(id));

const servicesSlice = createSlice({
  name: 'services',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(saveService.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
        else state.items.push(action.payload);
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload.id);
      });
  },
});

export default servicesSlice.reducer;
