interface User {
    username: string | null;
    role: string | null;
    email: string | null;
    image: string | null;
    phone_number: string | null;
    codeforce_name: string | null;
}
interface AuthState {
    user: User | null;
    access_token: string | null;
}
export declare const setAuth: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    user: User;
    access_token: string;
}, "auth/setAuth">, logout: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"auth/logout">;
declare const _default: import("redux").Reducer<AuthState>;
export default _default;
