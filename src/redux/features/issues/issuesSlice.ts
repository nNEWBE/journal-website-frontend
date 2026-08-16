import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { issuesApi, type IssueData } from "@/lib/api";
import { issues as fallbackIssues } from "@/lib/data";

export interface IssuesState {
  issues: IssueData[];
  currentIssue: IssueData | null;
  selectedIssue: IssueData | null;
  isLoading: boolean;
  error: string | null;
}

const initialFallbackCurrent = fallbackIssues[0];

const initialState: IssuesState = {
  issues: fallbackIssues.map((i, idx) => ({
    id: idx + 1,
    issueKey: i.id,
    year: i.year,
    volumeLabel: i.volume,
    issueLabel: i.issue,
    month: i.month,
    theme: i.theme,
    articleCount: i.articleCount,
    articles: i.articles,
    current: idx === 0,
    coverImageUrl: "/covers/medical.png",
    editorNote: "Official publication of Gono Bishwabidyalay",
  })),
  currentIssue: initialFallbackCurrent
    ? {
        id: 1,
        issueKey: initialFallbackCurrent.id,
        year: initialFallbackCurrent.year,
        volumeLabel: initialFallbackCurrent.volume,
        issueLabel: initialFallbackCurrent.issue,
        month: initialFallbackCurrent.month,
        theme: initialFallbackCurrent.theme,
        articleCount: initialFallbackCurrent.articleCount,
        articles: initialFallbackCurrent.articles,
        current: true,
        coverImageUrl: "/covers/medical.png",
        editorNote: "Official publication of Gono Bishwabidyalay",
      }
    : null,
  selectedIssue: null,
  isLoading: false,
  error: null,
};

export const fetchIssues = createAsyncThunk<
  IssueData[],
  void,
  { rejectValue: string }
>("issues/fetchIssues", async (_, { rejectWithValue }) => {
  try {
    const list = await issuesApi.list();
    return list.length > 0 ? list : initialState.issues;
  } catch {
    return initialState.issues;
  }
});

export const fetchCurrentIssue = createAsyncThunk<
  IssueData,
  void,
  { rejectValue: string }
>("issues/fetchCurrentIssue", async (_, { rejectWithValue }) => {
  try {
    return await issuesApi.getCurrent();
  } catch {
    if (initialState.currentIssue) return initialState.currentIssue;
    return rejectWithValue("Failed to fetch current issue");
  }
});

export const fetchIssueByKey = createAsyncThunk<
  IssueData,
  string,
  { rejectValue: string }
>("issues/fetchIssueByKey", async (key, { rejectWithValue }) => {
  try {
    return await issuesApi.getByKey(key);
  } catch (error) {
    const local = initialState.issues.find(
      (i) => i.issueKey === key || `${i.volumeLabel}-${i.issueLabel}` === key
    );
    if (local) return local;
    const msg = error instanceof Error ? error.message : "Issue not found";
    return rejectWithValue(msg);
  }
});

export const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    setSelectedIssue: (state, action: PayloadAction<IssueData | null>) => {
      state.selectedIssue = action.payload;
    },
  },
  extraReducers: (builder) => {
    // List
    builder.addCase(fetchIssues.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchIssues.fulfilled, (state, action) => {
      state.isLoading = false;
      state.issues = action.payload;
    });
    builder.addCase(fetchIssues.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to fetch issues";
    });

    // Current Issue
    builder.addCase(fetchCurrentIssue.fulfilled, (state, action) => {
      state.currentIssue = action.payload;
    });

    // Detail
    builder.addCase(fetchIssueByKey.fulfilled, (state, action) => {
      state.selectedIssue = action.payload;
    });
  },
});

export const { setSelectedIssue } = issuesSlice.actions;
export default issuesSlice.reducer;
