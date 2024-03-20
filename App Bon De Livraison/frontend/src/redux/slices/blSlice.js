import { createSlice } from '@reduxjs/toolkit';
import { createBL, fetchBLById } from '../actions/blActions';

const initialState = {
  bls: [],
  loading: false,
  error: null,
};

const blSlice = createSlice({
  name: 'bl',
  initialState,
  reducers: {
    // Your additional reducers, if any
  },
  extraReducers: (builder) => {
    builder
      // Reducer for creating BL
      .addCase(createBL.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBL.fulfilled, (state, action) => {
        state.loading = false;
        state.bls.push(action.payload);
      })
      .addCase(createBL.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Reducer for fetching BL by ID
      .addCase(fetchBLById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBLById.fulfilled, (state, action) => {
        // Assuming action.payload contains the fetched BL by ID
        // You might need to update the logic based on the actual response structure
        state.loading = false;
        state.bls.push(action.payload);
      })
      .addCase(fetchBLById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default blSlice.reducer;
