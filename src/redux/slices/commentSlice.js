import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData, postData, putData, deleteData } from '../../axios';
const initialState = {
    adminRates: [],
    userRates: [],
    userComments: [],
    totalAdmin: 0,
    totalRateUser: 0,
    totalCommentUser: 0,
    loading: false,
    error: null,
};
// Thunks for CRUD operations
export const fetchAdminRates = createAsyncThunk('rates/fetchAdminRates', async ({ page, limit }, { rejectWithValue }) => {
    try {
        const response = await getData(`api/admin/rates?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        });
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch rates');
    }
});
export const fetchUserRates = createAsyncThunk('rates/fetchUserRates', async ({ id_ref_material, ref_type }, { rejectWithValue }) => {
    try {
        const type = "RATE";
        const response = await getData(`api/interactions?id_ref_material=${id_ref_material}&ref_type=${ref_type}&type=${type}`, {});
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch rates');
    }
});
export const fetchUserComments = createAsyncThunk('comments/fetchUserComments', async ({ id_ref_material, ref_type }, { rejectWithValue }) => {
    try {
        const type = "COMMENT";
        const response = await getData(`api/interactions?id_ref_material=${id_ref_material}&ref_type=${ref_type}&type=${type}`, {});
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch rates');
    }
});
export const createRate = createAsyncThunk('rates/createRate', async (rateData, { rejectWithValue }) => {
    try {
        const response = await postData('api/user/interaction', rateData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            },
        });
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to create rate');
    }
});
export const createComment = createAsyncThunk('comments/createComment', async (rateData, { rejectWithValue }) => {
    try {
        const response = await postData('api/user/interaction', rateData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            },
        });
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to create rate');
    }
});
export const updateRate = createAsyncThunk('rates/updateRate', async ({ rateId, updatedData }, { rejectWithValue }) => {
    try {
        const response = await putData(`api/admin/rate/${rateId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to update rate');
    }
});
export const deleteRate = createAsyncThunk('rates/deleteRate', async (rateId, { rejectWithValue }) => {
    try {
        await deleteData(`api/admin/rate/${rateId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        });
        return rateId;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to delete rate');
    }
});
// Create the rate slice
const rateSlice = createSlice({
    name: 'rates',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch rates
            .addCase(fetchAdminRates.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchAdminRates.fulfilled, (state, action) => {
            state.loading = false;
            state.adminRates = action.payload.data;
            state.totalAdmin = action.payload.total;
        })
            .addCase(fetchAdminRates.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            // Fetch Rates
            .addCase(fetchUserRates.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchUserRates.fulfilled, (state, action) => {
            state.loading = false;
            state.userRates = action.payload.data;
            state.totalRateUser = action.payload.total;
        })
            .addCase(fetchUserRates.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            // Create Rate
            .addCase(createRate.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(createRate.fulfilled, (state, action) => {
            state.loading = false;
            const createdRates = action.payload.data;
            console.log(action.payload, state.userRates, createdRates, state.userRates.concat(createdRates));
            state.userRates = state.userRates.concat(createdRates);
            state.totalRateUser = state.totalRateUser + 1;
        })
            .addCase(createRate.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            // Update Rate
            .addCase(updateRate.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(updateRate.fulfilled, (state, action) => {
            state.loading = false;
            const updatedRate = action.payload.data;
            const index = state.adminRates.findIndex((rate) => rate._id === updatedRate._id);
            if (index !== -1) {
                state.adminRates[index] = updatedRate;
            }
        })
            .addCase(updateRate.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            // Delete Rate
            .addCase(deleteRate.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(deleteRate.fulfilled, (state, action) => {
            state.loading = false;
            state.adminRates = state.adminRates.filter((rate) => rate._id !== action.payload);
            state.totalAdmin = state.totalAdmin - 1;
        })
            .addCase(deleteRate.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});
export default rateSlice.reducer;
