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
interface UserState {
    yourCourses: Course[];
    yourExams: Exam[];
    totalCourse: number;
    totalExam: number;
    selectedCourse: Course | null;
    selectedExam: Exam | null;
    loading: boolean;
    error: string | null;
}
export declare const fetchYourMaterial: import("@reduxjs/toolkit").AsyncThunk<any, {
    id_user: string;
}, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchYourCourseDetail: import("@reduxjs/toolkit").AsyncThunk<any, {
    id_user: string;
    id_course: string;
}, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createProgress: import("@reduxjs/toolkit").AsyncThunk<any, {
    id_user: string;
    id_course: string;
    id_lesson: string;
}, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
declare const _default: import("redux").Reducer<UserState>;
export default _default;
