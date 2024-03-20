import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import BASE_URL from '../../services/apiConfig';
export const registerUser = createAsyncThunk('auth/registerUser', async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/register`, userData);
    console.log(response.data);
    return { success: true, data: response.data }; // Assuming the response contains necessary user and token data
  } catch (error) {
    if (error.response && error.response.status === 400 && error.response.data.message) {
      // Check specifically for a 400 Bad Request status and a message indicating an existing email
      throw new Error(error.response.data.message);
    } else {
      // For other types of errors, throw a generic error message
      throw new Error('An error occurred during registration.');
    }
  }
});



