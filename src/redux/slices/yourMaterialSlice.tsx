import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData, postData } from '../../axios';

// Define the type for a user
interface Course {
  _id: string;
  id_user: string;
  name: string;
  image: string;
  video: string;
  price: string;
  discount: string;
  totalCompletedLessons: number;
  topics: any;
  totalLessons: any;
  courseProgress: any;
  isCompleted: any;
  totalProgress: any;
}

interface Exam {
  _id: string;
  id_user: string;
  name: string;
  image: string;
  video: string;
  price: string;
  discount: string;
  score: any;
}

// Define the initial state
interface UserState {
  yourCourses: Course[];
  yourExams: Exam[];
  totalCourse: number;
  totalExam: number;
  selectedCourse: Course | null,
  selectedExam: Exam | null,
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
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

export const fetchYourMaterial = createAsyncThunk(
  'courses/fetchYourMaterial',
  async ({id_user}: {id_user: string}, { rejectWithValue }) => {
    try {
      const response = await getData(`api/user/your-materials?id_user=${id_user}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      console.log(response);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch Courses');
    }
  }
);

export const fetchYourCourseDetail = createAsyncThunk(
  'courses/fetchYourCourseDetail',
  async ({id_user, id_course}: {id_user: string, id_course: string}, { rejectWithValue }) => {
    try {
      const response = await getData(`api/user/your-course-detail?id_user=${id_user}&id_course=${id_course}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch course details');
    }
  }
);

export const createProgress = createAsyncThunk(
  'courses/createProgress',
  async ({id_user, id_course, id_lesson}: {id_user: string, id_course: string, id_lesson: string}, { rejectWithValue }) => {
    try {
      const response = await postData(
        "api/user/progress",
        {
          id_user,
          id_course,
          id_lesson,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch course details');
    }
  }
);

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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
      })

      .addCase(createProgress.fulfilled, (state, action) => {
        if (!state.selectedCourse) return;
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
      })
  },
});

export default yourMaterialSlice.reducer;
