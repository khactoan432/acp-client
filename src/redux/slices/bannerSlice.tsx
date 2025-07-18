import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData, postData, putData, deleteData } from '../../axios';

// Define the type for a banner
interface Banner {
  _id: string;
  image: string;
}

// Define the initial state
export interface BannerState {
  adminBanners: Banner[]; // Banner dành cho admin
  userBanners: Banner[]; // Banner hiển thị cho user
  totalAdmin: number;
  totalUser: number;
  loading: boolean;
  error: string | null;
}

const initialState: BannerState = {
  adminBanners: [],
  userBanners: [],
  totalAdmin: 0,
  totalUser: 0,
  loading: false,
  error: null,
};


// Thunks for CRUD operations
export const fetchAdminBanners = createAsyncThunk(
  'banners/fetchAdminBanners',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await getData(`api/admin/banners?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch admin banners');
    }
  }
);

export const fetchUserBanners = createAsyncThunk(
  'banners/fetchUserBanners',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await getData(`api/banners?page=${page}&limit=${limit}`, {});
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user banners');
    }
  }
);

export const createBanner = createAsyncThunk(
  'banners/createBanner',
  async (bannerData: object, { rejectWithValue }) => {
    try {
      const response = await postData('api/admin/banner', bannerData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create banner');
    }
  }
);

export const updateBanner = createAsyncThunk(
  'banners/updateBanner',
  async (
    { bannerId, updatedData }: { bannerId: string; updatedData: object },
    { rejectWithValue }
  ) => {
    try {
      const response = await putData(`api/admin/banner/${bannerId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update banner');
    }
  }
);

export const deleteBanner = createAsyncThunk(
  'banners/deleteBanner',
  async (bannerId: string, { rejectWithValue }) => {
    try {
      await deleteData(`api/admin/banner/${bannerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      return bannerId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete banner');
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
      // Fetch Admin Banners
      .addCase(fetchAdminBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.adminBanners = action.payload.data;
        state.totalAdmin = action.payload.total;
      })
      .addCase(fetchAdminBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch User Banners
      .addCase(fetchUserBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.userBanners = action.payload.data;
        state.totalUser = action.payload.total;
      })
      .addCase(fetchUserBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Banner
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        const createdBanners = action.payload.data;

        state.adminBanners=state.adminBanners.concat(createdBanners);
        state.totalAdmin = state.totalAdmin + action.payload.data.length;
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Banner
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBanner = action.payload.data;
        const index = state.adminBanners.findIndex((banner) => banner._id === updatedBanner._id);
        if (index !== -1) {
          state.adminBanners[index] = updatedBanner;
        }
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Banner
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.adminBanners = state.adminBanners.filter((banner) => banner._id !== action.payload);
        state.totalAdmin = state.totalAdmin - 1;
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default bannerSlice.reducer;
