interface Order {
    _id: string;
    code: string;
    type: string;
    method: string;
    payment_status: string;
    createdAt: string;
    materialDetails: any;
    userDetails: any;
}
interface OrderState {
    adminOrders: Order[];
    userOrders: Order[];
    totalAdmin: number;
    totalUser: number;
    loading: boolean;
    error: string | null;
}
export declare const fetchAdminOrders: import("@reduxjs/toolkit").AsyncThunk<any, {
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
export declare const fetchUserOrders: import("@reduxjs/toolkit").AsyncThunk<any, {
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
export declare const updateOrder: import("@reduxjs/toolkit").AsyncThunk<any, {
    orderId: string;
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
export declare const deleteOrder: import("@reduxjs/toolkit").AsyncThunk<string, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
declare const _default: import("redux").Reducer<OrderState>;
export default _default;
