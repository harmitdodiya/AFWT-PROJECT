import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStep: 0,
  selectedService: null,
  selectedBarber: null,
  selectedDate: null,
  selectedTimeSlot: null,
  validationState: { isCurrentStepValid: false },
};

const bookingSlice = createSlice({
  name: 'bookingWizard',
  initialState,
  reducers: {
    setService(state, action) {
      state.selectedService = action.payload;
      state.validationState.isCurrentStepValid = Boolean(action.payload);
    },
    setBarber(state, action) {
      state.selectedBarber = action.payload;
      state.validationState.isCurrentStepValid = Boolean(action.payload);
    },
    setDateTime(state, action) {
      state.selectedDate = action.payload.date;
      state.selectedTimeSlot = action.payload.time;
      state.validationState.isCurrentStepValid = Boolean(action.payload.date && action.payload.time);
    },
    goToStep(state, action) {
      state.currentStep = action.payload;
    },
    nextStep(state) {
      if (state.validationState.isCurrentStepValid) {
        state.currentStep += 1;
        // Confirmation step is always "valid" to view; earlier steps compute
        // their own validity when a selection is made.
        state.validationState.isCurrentStepValid =
          state.currentStep === 1
            ? Boolean(state.selectedBarber)
            : state.currentStep === 2
            ? Boolean(state.selectedDate && state.selectedTimeSlot)
            : true;
      }
    },
    prevStep(state) {
      state.currentStep = Math.max(0, state.currentStep - 1);
      state.validationState.isCurrentStepValid = true;
    },
    resetBooking() {
      return initialState;
    },
  },
});

export const { setService, setBarber, setDateTime, goToStep, nextStep, prevStep, resetBooking } =
  bookingSlice.actions;
export default bookingSlice.reducer;
