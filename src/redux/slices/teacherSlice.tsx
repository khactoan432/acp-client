import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData, postData, putData, deleteData } from '../../axios';

// Define the type for a user
interface User {
  _id: string;
  name: string;
  image: string;
  email: string;
  password: string;
  repassword: string;
  phone_number: string;
  codeforce_name: string;
}

// Define the initial state
export interface UserState {
  adminTeachers: User[];
  userTeachers: User[];
  totalAdmin: number;
  totalUser: number;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  adminTeachers: [],
  userTeachers: [],
  totalAdmin: 0,
  totalUser: 0,
  loading: false,
  error: null,
};

// Thunks for CRUD operations
export const fetchAdminTeachers = createAsyncThunk(
  'teachers/fetchAdminTeachers',
  async ({role, page, limit}: {role: string, page: number, limit: number}, { rejectWithValue }) => {
    try {
      const response = await getData(`api/admin/users?role=${role}&page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch Teachers');
    }
  }
);

export const fetchUserTeachers = createAsyncThunk(
  'teachers/fetchUserTeachers',
  async ({role, page, limit}: {role: string, page: number, limit: number}, { rejectWithValue }) => {
    try {
      const response = await getData(`api/users?role=${role}&page=${page}&limit=${limit}`, {});
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch Teachers');
    }
  }
);

export const createTeacher = createAsyncThunk(
  'teachers/createTeacher',
  async (userData: object, { rejectWithValue }) => {
    try {
      const response = await postData('api/admin/user', userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create Teacher');
    }
  }
);

export const updateTeacher = createAsyncThunk(
  'teachers/updateTeacher',
  async (
    { userId, updatedData }: { userId: string; updatedData: object },
    { rejectWithValue }
  ) => {
    try {
      const response = await putData(`api/admin/user/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update Teacher');
    }
  }
);

export const deleteTeacher = createAsyncThunk(
  'teachers/deleteTeacher',
  async (userId: string, { rejectWithValue }) => {
    try {
      await deleteData(`api/admin/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete Teacher');
    }
  }
);

// Create the Teacher slice
const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Admin teachers
      .addCase(fetchAdminTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.adminTeachers = action.payload.data;
        state.totalAdmin = action.payload.total;
      })
      .addCase(fetchAdminTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch User teachers
      .addCase(fetchUserTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.userTeachers = action.payload.data;
        state.totalUser = action.payload.total;
      })
      .addCase(fetchUserTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Teacher
      .addCase(createTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.loading = false;
        const createdTeachers = action.payload.data;
        console.log(action.payload ,state.adminTeachers, createdTeachers, state.adminTeachers.concat(createdTeachers))

        state.adminTeachers=state.adminTeachers.concat(createdTeachers);
        state.totalAdmin = state.totalAdmin + 1;
      })
      .addCase(createTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Teacher
      .addCase(updateTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTeacher = action.payload.data;
        const index = state.adminTeachers.findIndex((user) => user._id === updatedTeacher._id);
        if (index !== -1) {
          state.adminTeachers[index] = updatedTeacher;
        }
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Teacher
      .addCase(deleteTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.adminTeachers = state.adminTeachers.filter((user) => user._id !== action.payload);
        state.totalAdmin = state.totalAdmin - 1;
      })
      .addCase(deleteTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default teacherSlice.reducer;
