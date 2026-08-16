import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { articlesApi, type ArticleSearchParams } from "@/lib/api";
import { articles as fallbackArticles, type Article } from "@/lib/data";

export interface ArticlesState {
  items: Article[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  selectedArticle: Article | null;
  filters: {
    query: string;
    topic: string;
    type: string;
    issue: string;
    sort: "newest" | "oldest" | "views" | "downloads" | "title";
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: ArticlesState = {
  items: fallbackArticles,
  totalElements: fallbackArticles.length,
  totalPages: 1,
  currentPage: 0,
  selectedArticle: null,
  filters: {
    query: "",
    topic: "All Topics",
    type: "All Categories",
    issue: "All Issues",
    sort: "newest",
  },
  isLoading: false,
  error: null,
};

export const fetchArticles = createAsyncThunk<
  { content: Article[]; totalElements: number; totalPages: number; page: number },
  ArticleSearchParams | undefined,
  { rejectValue: string }
>("articles/fetchArticles", async (params = {}, { rejectWithValue }) => {
  try {
    const res = await articlesApi.list(params);
    return {
      content: res.content && res.content.length > 0 ? res.content : fallbackArticles,
      totalElements: res.totalElements || fallbackArticles.length,
      totalPages: res.totalPages || 1,
      page: res.number || 0,
    };
  } catch {
    // Return fallback articles if backend unreachable
    return {
      content: fallbackArticles,
      totalElements: fallbackArticles.length,
      totalPages: 1,
      page: 0,
    };
  }
});

export const fetchArticleBySlug = createAsyncThunk<
  Article,
  string,
  { rejectValue: string }
>("articles/fetchArticleBySlug", async (slug, { rejectWithValue }) => {
  try {
    return await articlesApi.getBySlug(slug);
  } catch (error) {
    const local = fallbackArticles.find((a) => a.slug === slug || a.id === slug);
    if (local) return local;
    const msg = error instanceof Error ? error.message : "Article not found";
    return rejectWithValue(msg);
  }
});

export const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.query = action.payload;
    },
    setTopicFilter: (state, action: PayloadAction<string>) => {
      state.filters.topic = action.payload;
    },
    setTypeFilter: (state, action: PayloadAction<string>) => {
      state.filters.type = action.payload;
    },
    setIssueFilter: (state, action: PayloadAction<string>) => {
      state.filters.issue = action.payload;
    },
    setSortOrder: (
      state,
      action: PayloadAction<"newest" | "oldest" | "views" | "downloads" | "title">
    ) => {
      state.filters.sort = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        query: "",
        topic: "All Topics",
        type: "All Categories",
        issue: "All Issues",
        sort: "newest",
      };
    },
    setSelectedArticle: (state, action: PayloadAction<Article | null>) => {
      state.selectedArticle = action.payload;
    },
  },
  extraReducers: (builder) => {
    // List
    builder.addCase(fetchArticles.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.page;
    });
    builder.addCase(fetchArticles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to load articles";
    });

    // Detail
    builder.addCase(fetchArticleBySlug.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchArticleBySlug.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedArticle = action.payload;
    });
    builder.addCase(fetchArticleBySlug.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to fetch article";
    });
  },
});

export const {
  setSearchQuery,
  setTopicFilter,
  setTypeFilter,
  setIssueFilter,
  setSortOrder,
  resetFilters,
  setSelectedArticle,
} = articlesSlice.actions;

export default articlesSlice.reducer;
