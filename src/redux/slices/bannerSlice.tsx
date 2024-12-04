import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData } from '../../axios'; // Import your API utility

// Define the type for a banner
interface Banner {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
}

// Define the initial state
interface BannerState {
  banners: Banner[]; // List of banners
  loading: boolean;  // Loading state
  error: string | null; // Error message
}

const initialState: BannerState = {
  banners: [],
  loading: false,
  error: null,
};

// Thunk to fetch banners
export const fetchBanners = createAsyncThunk(
  'banners/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getData('/banners'); // Call the GET API utility
      return response; // Assuming the response is the list of banners
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch banners');
    }
  }
);

// Create the banner slice
const bannerSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload; // Set banners when API call is successful
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Set error message on failure
      });
  },
});

export default bannerSlice.reducer;
