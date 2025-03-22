import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData, postData, putData, deleteData } from '../../axios';
const initialState = {
    adminCourses: [],
    userCourses: [],
    totalAdmin: 0,
    totalUser: 0,
    selectedCourse: null,
    loading: false,
    error: null,
};
// Thunks for CRUD operations
export const fetchUserCourses = createAsyncThunk('courses/fetchUserCourses', async ({ page, limit }, { rejectWithValue }) => {
    try {
        const response = await getData(`api/courses?page=${page}&limit=${limit}`, {});
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch Courses');
    }
});
export const fetchCourseDetail = createAsyncThunk('courses/fetchCourseDetail', async (courseId, { rejectWithValue }) => {
    try {
        const response = await getData(`api/course/${courseId}`, {});
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch course details');
    }
});
export const fetchAdminCourses = createAsyncThunk('courses/fetchAdminCourses', async ({ role, page, limit }, { rejectWithValue }) => {
    try {
        const response = await getData(`api/admin/users?role=${role}&page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        });
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch Courses');
    }
});
export const createCourse = createAsyncThunk('courses/createCourse', async (userData, { rejectWithValue }) => {
    try {
        const response = await postData('api/admin/user', userData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to create Course');
    }
});
export const updateCourse = createAsyncThunk('courses/updateCourse', async ({ userId, updatedData }, { rejectWithValue }) => {
    try {
        const response = await putData(`api/admin/user/${userId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to update Course');
    }
});
export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (userId, { rejectWithValue }) => {
    try {
        await deleteData(`api/admin/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        });
        return userId;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to delete Course');
    }
});
// Create the Course slice
const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch User Courses
            .addCase(fetchUserCourses.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchUserCourses.fulfilled, (state, action) => {
            state.loading = false;
            state.userCourses = action.payload.data;
            state.totalUser = action.payload.total;
        })
            .addCase(fetchUserCourses.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            // Fetch course detail
            .addCase(fetchCourseDetail.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchCourseDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedCourse = action.payload.data.course;
        })
            .addCase(fetchCourseDetail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            // Fetch Admin Courses
            .addCase(fetchAdminCourses.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchAdminCourses.fulfilled, (state, action) => {
            state.loading = false;
            state.adminCourses = action.payload.data;
            state.totalAdmin = action.payload.total;
        })
            .addCase(fetchAdminCourses.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            // Create Course
            .addCase(createCourse.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(createCourse.fulfilled, (state, action) => {
            state.loading = false;
            const createdCourses = action.payload.data;
            console.log(action.payload, state.adminCourses, createdCourses, state.adminCourses.concat(createdCourses));
            state.adminCourses = state.adminCourses.concat(createdCourses);
            state.totalAdmin = state.totalAdmin + 1;
        })
            .addCase(createCourse.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            // Update Course
            .addCase(updateCourse.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(updateCourse.fulfilled, (state, action) => {
            state.loading = false;
            const updatedCourse = action.payload.data;
            const index = state.adminCourses.findIndex((user) => user._id === updatedCourse._id);
            if (index !== -1) {
                state.adminCourses[index] = updatedCourse;
            }
        })
            .addCase(updateCourse.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            // Delete Course
            .addCase(deleteCourse.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(deleteCourse.fulfilled, (state, action) => {
            state.loading = false;
            state.adminCourses = state.adminCourses.filter((user) => user._id !== action.payload);
            state.totalAdmin = state.totalAdmin - 1;
        })
            .addCase(deleteCourse.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});
export default courseSlice.reducer;
