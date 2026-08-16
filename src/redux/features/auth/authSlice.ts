import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { authApi, type LoginPayload, type RegisterPayload, setTokens, clearTokens } from "@/lib/api";
import { getSession, setSession, clearSession, type User } from "@/lib/auth";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialUser = getSession();

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  User,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const res = await authApi.login(credentials);
    const user: User = {
      email: res.user.email,
      name: res.user.name || res.user.fullName,
      role: res.user.role,
      title: res.user.title || "Academic Member",
      department: res.user.department,
      institution: res.user.institution,
      avatar: res.user.avatar || res.user.avatarUrl,
    };
    setSession(user);
    return user;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Authentication failed";
    return rejectWithValue(msg);
  }
});

export const registerUser = createAsyncThunk<
  User,
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const res = await authApi.register(payload);
    const user: User = {
      email: res.user.email,
      name: res.user.name || res.user.fullName,
      role: res.user.role,
      title: res.user.title || "Author",
      department: res.user.department,
      institution: res.user.institution,
      avatar: res.user.avatar || res.user.avatarUrl,
    };
    setSession(user);
    return user;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Registration failed";
    return rejectWithValue(msg);
  }
});

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const data = await authApi.getMe();
    const user: User = {
      email: data.email,
      name: data.name || data.fullName,
      role: data.role,
      title: data.title,
      department: data.department,
      institution: data.institution,
      avatar: data.avatar || data.avatarUrl,
    };
    setSession(user);
    return user;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to load session";
    return rejectWithValue(msg);
  }
});

export const logoutUser = createAsyncThunk<void, void>(
  "auth/logout",
  async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    }
    clearTokens();
    clearSession();
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      setSession(action.payload);
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      clearTokens();
      clearSession();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Login failed";
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Registration failed";
    });

    // Fetch Current User
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    });
  },
});

export const { setUser, clearAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
