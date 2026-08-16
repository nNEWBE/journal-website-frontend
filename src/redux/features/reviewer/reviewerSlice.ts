import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reviewerApi, type SubmitReviewPayload } from "@/lib/api";
import { submissions as fallbackSubmissions, type Submission } from "@/lib/data";

export interface ReviewerState {
  assignments: Submission[];
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;
}

const initialState: ReviewerState = {
  assignments: fallbackSubmissions.filter(
    (s) => s.status.toLowerCase().includes("review")
  ),
  isLoading: false,
  isActionLoading: false,
  error: null,
};

export const fetchMyAssignments = createAsyncThunk<
  Submission[],
  void,
  { rejectValue: string }
>("reviewer/fetchMyAssignments", async (_, { rejectWithValue }) => {
  try {
    const list = await reviewerApi.getMyAssignments();
    return list.length > 0 ? list : initialState.assignments;
  } catch {
    return initialState.assignments;
  }
});

export const acceptReviewInvitationThunk = createAsyncThunk<
  { message: string; id: number | string },
  number | string,
  { rejectValue: string }
>("reviewer/acceptInvitation", async (id, { rejectWithValue }) => {
  try {
    const res = await reviewerApi.acceptInvitation(id);
    return { ...res, id };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to accept invitation";
    return rejectWithValue(msg);
  }
});

export const declineReviewInvitationThunk = createAsyncThunk<
  { message: string; id: number | string },
  number | string,
  { rejectValue: string }
>("reviewer/declineInvitation", async (id, { rejectWithValue }) => {
  try {
    const res = await reviewerApi.declineInvitation(id);
    return { ...res, id };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to decline invitation";
    return rejectWithValue(msg);
  }
});

export const submitReviewThunk = createAsyncThunk<
  { message: string; id: number | string },
  { id: number | string; payload: SubmitReviewPayload },
  { rejectValue: string }
>("reviewer/submitReview", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const res = await reviewerApi.submitReview(id, payload);
    return { ...res, id };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to submit review";
    return rejectWithValue(msg);
  }
});

export const reviewerSlice = createSlice({
  name: "reviewer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // List
    builder.addCase(fetchMyAssignments.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchMyAssignments.fulfilled, (state, action) => {
      state.isLoading = false;
      state.assignments = action.payload;
    });
    builder.addCase(fetchMyAssignments.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to load assignments";
    });

    // Accept
    builder.addCase(acceptReviewInvitationThunk.fulfilled, (state, action) => {
      const idx = state.assignments.findIndex((s) => s.id === action.payload.id.toString());
      if (idx !== -1) {
        state.assignments[idx].status = "Under Review";
      }
    });

    // Submit Review
    builder.addCase(submitReviewThunk.fulfilled, (state, action) => {
      const idx = state.assignments.findIndex((s) => s.id === action.payload.id.toString());
      if (idx !== -1) {
        state.assignments[idx].status = "Reviews Complete";
      }
    });
  },
});

export default reviewerSlice.reducer;
