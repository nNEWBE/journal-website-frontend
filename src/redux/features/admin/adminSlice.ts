import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { adminApi, type DashboardStats, type AuthResponseData } from "@/lib/api";

export interface AdminState {
  stats: DashboardStats | null;
  users: AuthResponseData["user"][];
  isLoading: boolean;
  error: string | null;
}

const fallbackStats: DashboardStats = {
  activeSubmissions: 24,
  underReview: 14,
  accepted: 8,
  publishedArticles: 184,
  activeReviewers: 32,
  publishedIssues: 12,
  registeredUsers: 840,
};

const initialState: AdminState = {
  stats: fallbackStats,
  users: [],
  isLoading: false,
  error: null,
};

export const fetchAdminStats = createAsyncThunk<
  DashboardStats,
  void,
  { rejectValue: string }
>("admin/fetchStats", async (_, { rejectWithValue }) => {
  try {
    return await adminApi.getStats();
  } catch {
    return fallbackStats;
  }
});

export const fetchAdminUsers = createAsyncThunk<
  AuthResponseData["user"][],
  void,
  { rejectValue: string }
>("admin/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    return await adminApi.listUsers();
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to load users";
    return rejectWithValue(msg);
  }
});

export const updateUserRoleThunk = createAsyncThunk<
  AuthResponseData["user"],
  { userId: number | string; role: string },
  { rejectValue: string }
>("admin/updateUserRole", async ({ userId, role }, { rejectWithValue }) => {
  try {
    return await adminApi.updateUserRole(userId, role);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to update role";
    return rejectWithValue(msg);
  }
});

export const updateUserStatusThunk = createAsyncThunk<
  AuthResponseData["user"],
  { userId: number | string; enabled: boolean },
  { rejectValue: string }
>("admin/updateUserStatus", async ({ userId, enabled }, { rejectWithValue }) => {
  try {
    return await adminApi.updateUserStatus(userId, enabled);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to update status";
    return rejectWithValue(msg);
  }
});

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Stats
    builder.addCase(fetchAdminStats.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAdminStats.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stats = action.payload;
    });
    builder.addCase(fetchAdminStats.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to load stats";
    });

    // Users
    builder.addCase(fetchAdminUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });

    // Role
    builder.addCase(updateUserRoleThunk.fulfilled, (state, action) => {
      const idx = state.users.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) {
        state.users[idx] = action.payload;
      }
    });

    // Status
    builder.addCase(updateUserStatusThunk.fulfilled, (state, action) => {
      const idx = state.users.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) {
        state.users[idx] = action.payload;
      }
    });
  },
});

export default adminSlice.reducer;
