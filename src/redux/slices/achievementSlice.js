import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData, postData, putData, deleteData } from '../../axios';
const initialState = {
    adminAchievements: [],
    userAchievements: [],
    totalAdmin: 0,
    totalUser: 0,
    loading: false,
    error: null,
};
// Thunks for CRUD operations
export const fetchAdminAchievements = createAsyncThunk('achievements/fetchAdminAchievements', async ({ page, limit }, { rejectWithValue }) => {
    try {
        const response = await getData(`api/admin/achievements?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        });
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch achievements');
    }
});
export const fetchUserAchievements = createAsyncThunk('achievements/fetchUserAchievements', async ({ page, limit }, { rejectWithValue }) => {
    try {
        const response = await getData(`api/achievements?page=${page}&limit=${limit}`, {});
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch achievements');
    }
});
export const createAchievement = createAsyncThunk('achievements/createAchievement', async (achievementData, { rejectWithValue }) => {
    try {
        const response = await postData('api/admin/achievement', achievementData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to create achievement');
    }
});
export const updateAchievement = createAsyncThunk('achievements/updateAchievement', async ({ achievementId, updatedData }, { rejectWithValue }) => {
    try {
        const response = await putData(`api/admin/achievement/${achievementId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to update achievement');
    }
});
export const deleteAchievement = createAsyncThunk('achievements/deleteAchievement', async (achievementId, { rejectWithValue }) => {
    try {
        await deleteData(`api/admin/achievement/${achievementId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        });
        return achievementId;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to delete achievement');
    }
});
// Create the achievement slice
const achievementSlice = createSlice({
    name: 'achievements',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Achievements
            .addCase(fetchAdminAchievements.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchAdminAchievements.fulfilled, (state, action) => {
            state.loading = false;
            state.adminAchievements = action.payload.data;
            state.totalAdmin = action.payload.total;
        })
            .addCase(fetchAdminAchievements.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            // Fetch Achievements
            .addCase(fetchUserAchievements.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchUserAchievements.fulfilled, (state, action) => {
            state.loading = false;
            state.userAchievements = action.payload.data;
            state.totalUser = action.payload.total;
        })
            .addCase(fetchUserAchievements.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            // Create Achievement
            .addCase(createAchievement.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(createAchievement.fulfilled, (state, action) => {
            state.loading = false;
            const createdAchievements = action.payload.data;
            console.log(action.payload, state.adminAchievements, createdAchievements, state.adminAchievements.concat(createdAchievements));
            state.adminAchievements = state.adminAchievements.concat(createdAchievements);
            state.totalAdmin = state.totalAdmin + 1;
        })
            .addCase(createAchievement.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            // Update Achievement
            .addCase(updateAchievement.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(updateAchievement.fulfilled, (state, action) => {
            state.loading = false;
            const updatedAchievement = action.payload.data;
            const index = state.adminAchievements.findIndex((achievement) => achievement._id === updatedAchievement._id);
            if (index !== -1) {
                state.adminAchievements[index] = updatedAchievement;
            }
        })
            .addCase(updateAchievement.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            // Delete Achievement
            .addCase(deleteAchievement.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(deleteAchievement.fulfilled, (state, action) => {
            state.loading = false;
            state.adminAchievements = state.adminAchievements.filter((achievement) => achievement._id !== action.payload);
            state.totalAdmin = state.totalAdmin - 1;
        })
            .addCase(deleteAchievement.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});
export default achievementSlice.reducer;
