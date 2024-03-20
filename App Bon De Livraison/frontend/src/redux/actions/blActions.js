import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import BASE_URL from '../../services/apiConfig';

export const createBL = createAsyncThunk(
  'bl/createBL',
  async ({ userId, blData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/bl/${userId}/createbl`, blData);
      return response.data; // Assuming the response contains the created BL data
    } catch (error) {
      return rejectWithValue(error.response.data); // Custom data handling for rejection
    }
  }
);

export const fetchBLById = createAsyncThunk(
  'bl/fetchBLById',
  async (blId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/bl/${blId}`);
      return response.data; // Assuming the response contains the requested BL data
    } catch (error) {
      return rejectWithValue(error.response.data); // Custom data handling for rejection
    }
  }
);




