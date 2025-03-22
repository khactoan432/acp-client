import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData, postData } from '../../axios';
const initialState = {
    yourCourses: [],
    yourExams: [],
    totalCourse: 0,
    totalExam: 0,
    selectedCourse: null,
    selectedExam: null,
    loading: false,
    error: null,
};
// Thunks for CRUD operations
export const fetchYourMaterial = createAsyncThunk('courses/fetchYourMaterial', async ({ id_user }, { rejectWithValue }) => {
    try {
        const response = await getData(`api/user/your-materials?id_user=${id_user}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        });
        console.log(response);
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch Courses');
    }
});
export const fetchYourCourseDetail = createAsyncThunk('courses/fetchYourCourseDetail', async ({ id_user, id_course }, { rejectWithValue }) => {
    try {
        const response = await getData(`api/user/your-course-detail?id_user=${id_user}&id_course=${id_course}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        });
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch course details');
    }
});
export const createProgress = createAsyncThunk('courses/createProgress', async ({ id_user, id_course, id_lesson }, { rejectWithValue }) => {
    try {
        const response = await postData("api/user/progress", {
            id_user,
            id_course,
            id_lesson,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch course details');
    }
});
// Create the Course slice
const yourMaterialSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch User Courses
            .addCase(fetchYourMaterial.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchYourMaterial.fulfilled, (state, action) => {
            state.loading = false;
            state.yourCourses = action.payload.orderCourse;
            state.yourExams = action.payload.orderExam;
        })
            .addCase(fetchYourMaterial.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            // Fetch course detail
            .addCase(fetchYourCourseDetail.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchYourCourseDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedCourse = action.payload;
        })
            .addCase(fetchYourCourseDetail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            .addCase(createProgress.fulfilled, (state, action) => {
            if (!state.selectedCourse)
                return;
            const { id_lesson } = action.payload.data;
            state.selectedCourse.topics = state.selectedCourse.topics.map((topic) => {
                let lessonCompleted = false; // Biến kiểm tra bài học nào được hoàn thành
                const updatedLessons = topic.lessons.map((lesson) => {
                    if (lesson._id === id_lesson) {
                        lessonCompleted = !lesson.isCompleted; // Nếu chưa hoàn thành thì đánh dấu hoàn thành
                        return { ...lesson, isCompleted: true };
                    }
                    return lesson;
                });
                return {
                    ...topic,
                    lessons: updatedLessons,
                    completedLessons: lessonCompleted ? topic.completedLessons + 1 : topic.completedLessons,
                };
            });
            // Cập nhật tổng số bài học đã hoàn thành trong course
            state.selectedCourse.totalCompletedLessons += 1;
        });
    },
});
export default yourMaterialSlice.reducer;
