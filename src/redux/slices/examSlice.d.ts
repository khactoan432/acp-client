interface Exam {
    _id: string;
    id_user: string;
    name: string;
    image: string;
    video: string;
    price: string;
    discount: string;
    describes: any;
}
interface UserState {
    adminExams: Exam[];
    userExams: Exam[];
    totalAdmin: number;
    totalUser: number;
    selectedExam: Exam | null;
    loading: boolean;
    error: string | null;
}
export declare const fetchUserExams: import("@reduxjs/toolkit").AsyncThunk<any, {
    page: number;
    limit: number;
    filters: {
        type: string;
        value: string[];
    }[];
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
export declare const fetchExamDetail: import("@reduxjs/toolkit").AsyncThunk<any, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchAdminExams: import("@reduxjs/toolkit").AsyncThunk<any, {
    role: string;
    page: number;
    limit: number;
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
export declare const createExam: import("@reduxjs/toolkit").AsyncThunk<any, object, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updateExam: import("@reduxjs/toolkit").AsyncThunk<any, {
    userId: string;
    updatedData: object;
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
export declare const deleteExam: import("@reduxjs/toolkit").AsyncThunk<string, string, {
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
