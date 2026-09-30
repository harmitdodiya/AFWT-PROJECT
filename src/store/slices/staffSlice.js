import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  apiFetchStaff,
  apiSaveStaff,
  apiDeleteStaff,
  apiBlockSlot,
  apiUnblockSlot,
} from '../../api/mockApi';

export const fetchStaff = createAsyncThunk('staff/fetch', async () => apiFetchStaff());
export const saveStaff = createAsyncThunk('staff/save', async (member) => apiSaveStaff(member));
export const deleteStaff = createAsyncThunk('staff/delete', async (id) => apiDeleteStaff(id));
export const blockSlot = createAsyncThunk('staff/blockSlot', async ({ staffId, slotLabel }) =>
  apiBlockSlot(staffId, slotLabel)
);
export const unblockSlot = createAsyncThunk('staff/unblockSlot', async ({ staffId, slotLabel }) =>
  apiUnblockSlot(staffId, slotLabel)
);

function upsert(state, action) {
  const idx = state.items.findIndex((s) => s.id === action.payload.id);
  if (idx >= 0) state.items[idx] = action.payload;
  else state.items.push(action.payload);
}

const staffSlice = createSlice({
  name: 'staff',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(saveStaff.fulfilled, upsert)
      .addCase(blockSlot.fulfilled, upsert)
      .addCase(unblockSlot.fulfilled, upsert)
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload.id);
      });
  },
});

export default staffSlice.reducer;
