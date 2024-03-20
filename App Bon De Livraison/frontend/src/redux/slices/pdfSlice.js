import { createSlice } from '@reduxjs/toolkit';
import { generatePdf } from '../actions/pdfActions';

const initialState = {
  pdfData: null,
  loading: false,
  error: null,
};

const pdfSlice = createSlice({
  name: 'pdf',
  initialState,
  reducers: {
    clearPdfData(state) {
      state.pdfData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generatePdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generatePdf.fulfilled, (state, action) => {
        state.loading = false;
        state.pdfData = action.payload;
      })
      .addCase(generatePdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearPdfData } = pdfSlice.actions;
export default pdfSlice.reducer;
