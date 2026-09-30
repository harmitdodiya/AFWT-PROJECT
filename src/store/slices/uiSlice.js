import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { snackbar: null },
  reducers: {
    showSnackbar(state, action) {
      state.snackbar = {
        message: action.payload.message,
        severity: action.payload.severity || 'success',
        key: Date.now(),
      };
    },
    clearSnackbar(state) {
      state.snackbar = null;
    },
  },
});

export const { showSnackbar, clearSnackbar } = uiSlice.actions;
export default uiSlice.reducer;
