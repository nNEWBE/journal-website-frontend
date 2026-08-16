import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import {
  submissionsApi,
  editorApi,
  type CreateSubmissionPayload,
  type EditorialDecisionPayload,
} from "@/lib/api";
import { submissions as fallbackSubmissions, type Submission } from "@/lib/data";

export interface SubmissionsState {
  mySubmissions: Submission[];
  editorSubmissions: Submission[];
  selectedSubmission: Submission | null;
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;
}

const initialState: SubmissionsState = {
  mySubmissions: fallbackSubmissions,
  editorSubmissions: fallbackSubmissions,
  selectedSubmission: null,
  isLoading: false,
  isActionLoading: false,
  error: null,
};

export const fetchMySubmissions = createAsyncThunk<
  Submission[],
  void,
  { rejectValue: string }
>("submissions/fetchMySubmissions", async (_, { rejectWithValue }) => {
  try {
    const list = await submissionsApi.getMySubmissions();
    return list.length > 0 ? list : fallbackSubmissions;
  } catch {
    return fallbackSubmissions;
  }
});

export const fetchEditorSubmissions = createAsyncThunk<
  Submission[],
  { status?: string; type?: string } | undefined,
  { rejectValue: string }
>("submissions/fetchEditorSubmissions", async (params = {}, { rejectWithValue }) => {
  try {
    const res = await editorApi.listSubmissions(params.status, params.type);
    return res.content && res.content.length > 0 ? res.content : fallbackSubmissions;
  } catch {
    return fallbackSubmissions;
  }
});

export const createDraftThunk = createAsyncThunk<
  Submission,
  CreateSubmissionPayload,
  { rejectValue: string }
>("submissions/createDraft", async (payload, { rejectWithValue }) => {
  try {
    return await submissionsApi.createDraft(payload);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to create draft";
    return rejectWithValue(msg);
  }
});

export const submitManuscriptThunk = createAsyncThunk<
  Submission,
  number | string,
  { rejectValue: string }
>("submissions/submitManuscript", async (id, { rejectWithValue }) => {
  try {
    return await submissionsApi.submit(id);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to submit manuscript";
    return rejectWithValue(msg);
  }
});

export const makeEditorialDecisionThunk = createAsyncThunk<
  Submission,
  { id: number | string; decision: EditorialDecisionPayload },
  { rejectValue: string }
>("submissions/makeEditorialDecision", async ({ id, decision }, { rejectWithValue }) => {
  try {
    return await editorApi.makeDecision(id, decision);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to record decision";
    return rejectWithValue(msg);
  }
});

export const submissionsSlice = createSlice({
  name: "submissions",
  initialState,
  reducers: {
    setSelectedSubmission: (state, action: PayloadAction<Submission | null>) => {
      state.selectedSubmission = action.payload;
    },
    updateLocalSubmissionStatus: (
      state,
      action: PayloadAction<{ id: string; status: string }>
    ) => {
      const idx1 = state.mySubmissions.findIndex((s) => s.id === action.payload.id);
      if (idx1 !== -1) {
        state.mySubmissions[idx1].status = action.payload.status;
      }
      const idx2 = state.editorSubmissions.findIndex((s) => s.id === action.payload.id);
      if (idx2 !== -1) {
        state.editorSubmissions[idx2].status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    // My submissions
    builder.addCase(fetchMySubmissions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchMySubmissions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.mySubmissions = action.payload;
    });
    builder.addCase(fetchMySubmissions.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to fetch submissions";
    });

    // Editor submissions
    builder.addCase(fetchEditorSubmissions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchEditorSubmissions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.editorSubmissions = action.payload;
    });
    builder.addCase(fetchEditorSubmissions.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to fetch editor queue";
    });

    // Create Draft
    builder.addCase(createDraftThunk.pending, (state) => {
      state.isActionLoading = true;
    });
    builder.addCase(createDraftThunk.fulfilled, (state, action) => {
      state.isActionLoading = false;
      state.mySubmissions.unshift(action.payload);
      state.selectedSubmission = action.payload;
    });
    builder.addCase(createDraftThunk.rejected, (state, action) => {
      state.isActionLoading = false;
      state.error = action.payload || "Failed to create draft";
    });

    // Submit
    builder.addCase(submitManuscriptThunk.fulfilled, (state, action) => {
      const idx = state.mySubmissions.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) {
        state.mySubmissions[idx] = action.payload;
      }
    });

    // Editorial Decision
    builder.addCase(makeEditorialDecisionThunk.fulfilled, (state, action) => {
      const idx = state.editorSubmissions.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) {
        state.editorSubmissions[idx] = action.payload;
      }
    });
  },
});

export const { setSelectedSubmission, updateLocalSubmissionStatus } =
  submissionsSlice.actions;

export default submissionsSlice.reducer;
