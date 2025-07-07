import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData, postData, putData, deleteData } from '../../axios';

interface Value {
  _id: string;
  value: string;
}

// Define the type for a Category
interface Category {
  _id: string;
  option: string;
  value: Value[];
}

// Define the initial state
export interface CategoryState {
  adminCategories: Category[];
  userCategories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  adminCategories: [],
  userCategories: [],
  loading: false,
  error: null,
};

// Thunks for CRUD operations
export const fetchAdminCategories = createAsyncThunk(
  'categories/fetchAdminCategories',
  async ({page, limit}: {page: number, limit: number}, { rejectWithValue }) => {
    try {
      const response = await getData(`api/admin/categories?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch Categories');
    }
  }
);

export const fetchUserCategories = createAsyncThunk(
  'categories/fetchUserCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getData(`api/categories`, {});
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch Categories');
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData: object, { rejectWithValue }) => {
    try {
      const response = await postData('api/admin/category', categoryData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (
    { categoryId, updatedData }: { categoryId: string; updatedData: object },
    { rejectWithValue }
  ) => {
    try {
      const response = await putData(`api/admin/category/${categoryId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      await deleteData(`api/admin/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      return categoryId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete category');
    }
  }
);

// Create the Category slice
const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchAdminCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.adminCategories = action.payload.data;
        // state.totalAdmin = action.payload.total;
      })
      .addCase(fetchAdminCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Categories
      .addCase(fetchUserCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.userCategories = action.payload.data;
      })
      .addCase(fetchUserCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        const createdCategories = action.payload.data;
        // console.log(action.payload ,state.adminCategories, createdCategories, state.adminCategories.concat(createdCategories))

        state.adminCategories=state.adminCategories.concat(createdCategories);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCategory = action.payload.data;
        const index = state.adminCategories.findIndex((category) => category._id === updatedCategory._id);
        if (index !== -1) {
          state.adminCategories[index] = updatedCategory;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.adminCategories = state.adminCategories.filter((category) => category._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;
