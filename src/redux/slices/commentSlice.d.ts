interface Rate {
    _id: string;
    id_user: string;
    id_ref_material: string;
    ref_type: string;
    type: string;
    rate: number;
    content: string;
    createdAt: string;
}
interface Comment {
    _id: string;
    id_user: string;
    id_ref_material: string;
    ref_type: string;
    type: string;
    content: string;
    createdAt: string;
}
interface RateState {
    adminRates: Rate[];
    userRates: Rate[];
    userComments: Comment[];
    totalAdmin: number;
    totalRateUser: number;
    totalCommentUser: number;
    loading: boolean;
    error: string | null;
}
export declare const fetchAdminRates: import("@reduxjs/toolkit").AsyncThunk<any, {
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
export declare const fetchUserRates: import("@reduxjs/toolkit").AsyncThunk<any, {
    id_ref_material: string;
    ref_type: string;
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
export declare const fetchUserComments: import("@reduxjs/toolkit").AsyncThunk<any, {
    id_ref_material: string;
    ref_type: string;
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
export declare const createRate: import("@reduxjs/toolkit").AsyncThunk<any, object, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createComment: import("@reduxjs/toolkit").AsyncThunk<any, object, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updateRate: import("@reduxjs/toolkit").AsyncThunk<any, {
    rateId: string;
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
export declare const deleteRate: import("@reduxjs/toolkit").AsyncThunk<string, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
declare const _default: import("redux").Reducer<RateState>;
export default _default;
