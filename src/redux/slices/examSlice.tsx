import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData, postData, putData, deleteData } from '../../axios';

// Define the type for a user
interface Exam {
  _id: string;
  id_user: string;
  name: string;
  image: string;
  video: string;
  price: string;
  discount: string;
}

// Define the initial state
interface UserState {
  adminExams: Exam[];
  userExams: Exam[];
  totalAdmin: number;
  totalUser: number;
  selectedExam: Exam | null,
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  adminExams: [],
  userExams: [],
  totalAdmin: 0,
  totalUser: 0,
  selectedExam: null,
  loading: false,
  error: null,
};

// Thunks for CRUD operations

export const fetchUserExams = createAsyncThunk(
  'exams/fetchUserExams',
  async (
    { page, limit, filters }: { page: number; limit: number; filters: { type: string; value: string[]}[] },
    { rejectWithValue }
  ) => {
    try {
      // Encode filters dưới dạng JSON string
      const filterParams = `filters=${encodeURIComponent(JSON.stringify(filters))}`;

      // Gọi API với các tham số cần thiết
      const response = await getData(
        `api/exams?page=${page}&limit=${limit}&${filterParams}`,
        {}
      );

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch Exams');
    }
  }
);

export const fetchExamDetail = createAsyncThunk(
  'exams/fetchExamDetail',
  async (examId: string, { rejectWithValue }) => {
    try {
      const response = await getData(`api/exam/${examId}`, {});
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch exam details');
    }
  }
);


export const fetchAdminExams = createAsyncThunk(
  'exams/fetchAdminExams',
  async ({role, page, limit}: {role: string, page: number, limit: number}, { rejectWithValue }) => {
    try {
      const response = await getData(`api/admin/users?role=${role}&page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch Exams');
    }
  }
);

export const createExam = createAsyncThunk(
  'exams/createExam',
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
      return rejectWithValue(error.message || 'Failed to create Exam');
    }
  }
);

export const updateExam = createAsyncThunk(
  'exams/updateExam',
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
      return rejectWithValue(error.message || 'Failed to update Exam');
    }
  }
);

export const deleteExam = createAsyncThunk(
  'exams/deleteExam',
  async (userId: string, { rejectWithValue }) => {
    try {
      await deleteData(`api/admin/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete Exam');
    }
  }
);

// Create the Exam slice
const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch User Exams
      .addCase(fetchUserExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserExams.fulfilled, (state, action) => {
        state.loading = false;
        state.userExams = action.payload.data;
        state.totalUser = action.payload.total;
      })
      .addCase(fetchUserExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Exam detail
      .addCase(fetchExamDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedExam = action.payload.data.exam;
      })
      .addCase(fetchExamDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Admin Exams
      .addCase(fetchAdminExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminExams.fulfilled, (state, action) => {
        state.loading = false;
        state.adminExams = action.payload.data;
        state.totalAdmin = action.payload.total;
      })
      .addCase(fetchAdminExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Exam
      .addCase(createExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.loading = false;
        const createdExams = action.payload.data;
        console.log(action.payload ,state.adminExams, createdExams, state.adminExams.concat(createdExams))

        state.adminExams=state.adminExams.concat(createdExams);
        state.totalAdmin = state.totalAdmin + 1;
      })
      .addCase(createExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Exam
      .addCase(updateExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExam.fulfilled, (state, action) => {
        state.loading = false;
        const updatedExam = action.payload.data;
        const index = state.adminExams.findIndex((user) => user._id === updatedExam._id);
        if (index !== -1) {
          state.adminExams[index] = updatedExam;
        }
      })
      .addCase(updateExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Exam
      .addCase(deleteExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.loading = false;
        state.adminExams = state.adminExams.filter((user) => user._id !== action.payload);
        state.totalAdmin = state.totalAdmin - 1;
      })
      .addCase(deleteExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default examSlice.reducer;
