/**
 * GB Journal Portal - Live Backend API Client
 * Connects Next.js frontend directly to Spring Boot backend (/api/v1)
 */

import { type Role, type Article, type Submission, type BoardMember } from "./data";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const ACCESS_TOKEN_KEY = "gb_journal_access_token";
const REFRESH_TOKEN_KEY = "gb_journal_refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setTokens(access: string, refresh?: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
    try {
      const errorJson = await res.json();
      if (errorJson.message) errorMessage = errorJson.message;
      else if (errorJson.error) errorMessage = errorJson.error;
    } catch {
      // Fallback
    }
    throw new Error(errorMessage);
  }

  // If response has no content (204 No Content), return empty object
  if (res.status === 204) {
    return {} as T;
  }

  return (await res.json()) as T;
}

// ==========================================
// 1. AUTH API
// ==========================================

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role?: string;
  department?: string;
  institution?: string;
  title?: string;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    fullName: string;
    name: string;
    email: string;
    role: Role;
    title: string;
    department?: string;
    institution?: string;
    avatarUrl?: string;
    avatar?: string;
    emailVerified: boolean;
  };
}

export const authApi = {
  login: async (data: LoginPayload): Promise<AuthResponseData> => {
    const res = await request<AuthResponseData>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.accessToken) {
      setTokens(res.accessToken, res.refreshToken);
    }
    return res;
  },

  register: async (data: RegisterPayload): Promise<AuthResponseData> => {
    const res = await request<AuthResponseData>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.accessToken) {
      setTokens(res.accessToken, res.refreshToken);
    }
    return res;
  },

  getMe: async (): Promise<AuthResponseData["user"]> => {
    return request<AuthResponseData["user"]>("/api/v1/auth/me");
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      const res = await request<{ message: string }>("/api/v1/auth/logout", {
        method: "POST",
      });
      clearTokens();
      return res;
    } catch (e) {
      clearTokens();
      return { message: "Logged out locally" };
    }
  },

  updateProfile: async (
    data: Partial<RegisterPayload>
  ): Promise<AuthResponseData["user"]> => {
    return request<AuthResponseData["user"]>("/api/v1/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// ==========================================
// 2. ARTICLES & DISCOVERY API
// ==========================================

export interface ArticleSearchParams {
  query?: string;
  type?: string;
  topic?: string;
  issue?: string;
  page?: number;
  size?: number;
  sort?: "newest" | "oldest" | "views" | "downloads" | "title";
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const articlesApi = {
  list: async (
    params: ArticleSearchParams = {}
  ): Promise<PageResult<Article>> => {
    const query = new URLSearchParams();
    if (params.query) query.set("query", params.query);
    if (params.type && params.type !== "All Categories") query.set("type", params.type);
    if (params.topic && params.topic !== "All Topics") query.set("topic", params.topic);
    if (params.issue && params.issue !== "All Issues") query.set("issue", params.issue);
    if (params.page !== undefined) query.set("page", params.page.toString());
    if (params.size !== undefined) query.set("size", params.size.toString());
    if (params.sort) query.set("sort", params.sort);

    return request<PageResult<Article>>(`/api/v1/articles?${query.toString()}`);
  },

  getBySlug: async (slug: string): Promise<Article> => {
    return request<Article>(`/api/v1/articles/${slug}`);
  },

  getTypes: async (): Promise<string[]> => {
    return request<string[]>("/api/v1/articles/types");
  },

  getTopics: async (): Promise<string[]> => {
    return request<string[]>("/api/v1/articles/topics");
  },

  trackDownload: async (slug: string): Promise<string> => {
    return request<string>(`/api/v1/articles/${slug}/download`, {
      method: "POST",
    });
  },
};

// ==========================================
// 3. ISSUES API
// ==========================================

export interface IssueData {
  id: number;
  issueKey: string;
  year: string;
  volumeLabel: string;
  issueLabel: string;
  month: string;
  theme: string;
  articleCount: number;
  current: boolean;
  coverImageUrl?: string;
  editorNote?: string;
  articles?: Article[];
  articlesByType?: Record<string, Article[]>;
}

export const issuesApi = {
  list: async (): Promise<IssueData[]> => {
    return request<IssueData[]>("/api/v1/issues");
  },

  getCurrent: async (): Promise<IssueData> => {
    return request<IssueData>("/api/v1/issues/current");
  },

  getByKey: async (issueKey: string): Promise<IssueData> => {
    return request<IssueData>(`/api/v1/issues/${issueKey}`);
  },
};

// ==========================================
// 4. METADATA & BOARD API
// ==========================================

export const metadataApi = {
  getTopics: async (): Promise<string[]> => {
    return request<string[]>("/api/v1/topics");
  },

  getArticleTypes: async (): Promise<string[]> => {
    return request<string[]>("/api/v1/article-types");
  },

  getEditorialBoard: async (): Promise<BoardMember[]> => {
    return request<BoardMember[]>("/api/v1/editorial-board");
  },
};

// ==========================================
// 5. SUBMISSIONS & AUTHOR SUITE API
// ==========================================

export interface CreateSubmissionPayload {
  title: string;
  runningTitle?: string;
  type: string;
  abstractText: string;
  keywords?: string;
  topic?: string;
  coverLetter?: string;
  conflictOfInterest?: string;
  fundingStatement?: string;
  ethicsStatement?: string;
  dataAvailability?: string;
  aiDeclaration?: string;
  copyrightAgreed: boolean;
  authors?: {
    name: string;
    email: string;
    affiliation?: string;
    orcid?: string;
    authorOrder: number;
    corresponding: boolean;
  }[];
}

export const submissionsApi = {
  createDraft: async (data: CreateSubmissionPayload): Promise<Submission> => {
    return request<Submission>("/api/v1/submissions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateDraft: async (
    id: number | string,
    data: CreateSubmissionPayload
  ): Promise<Submission> => {
    return request<Submission>(`/api/v1/submissions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  submit: async (id: number | string): Promise<Submission> => {
    return request<Submission>(`/api/v1/submissions/${id}/submit`, {
      method: "POST",
    });
  },

  submitRevision: async (
    id: number | string,
    notes: string
  ): Promise<Submission> => {
    return request<Submission>(`/api/v1/submissions/${id}/revisions`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    });
  },

  withdraw: async (id: number | string): Promise<Submission> => {
    return request<Submission>(`/api/v1/submissions/${id}/withdraw`, {
      method: "POST",
    });
  },

  uploadFile: async (
    id: number | string,
    file: File,
    fileType: "MANUSCRIPT_PRIMARY" | "FIGURE" | "SUPPLEMENTARY" | "COVER_LETTER"
  ): Promise<Submission> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);

    return request<Submission>(`/api/v1/submissions/${id}/files`, {
      method: "POST",
      body: formData,
    });
  },

  getMySubmissions: async (): Promise<Submission[]> => {
    return request<Submission[]>("/api/v1/submissions/my");
  },

  getById: async (id: number | string): Promise<Submission> => {
    return request<Submission>(`/api/v1/submissions/${id}`);
  },
};

// ==========================================
// 6. REVIEWER SUITE API
// ==========================================

export interface SubmitReviewPayload {
  recommendation: "ACCEPT" | "MINOR_REVISION" | "MAJOR_REVISION" | "REJECT";
  score: number;
  reviewComments: string;
  confidentialComments?: string;
}

export const reviewerApi = {
  getMyAssignments: async (): Promise<Submission[]> => {
    return request<Submission[]>("/api/v1/reviewer/assignments");
  },

  acceptInvitation: async (id: number | string): Promise<{ message: string }> => {
    return request<{ message: string }>(`/api/v1/reviewer/assignments/${id}/accept`, {
      method: "POST",
    });
  },

  declineInvitation: async (id: number | string): Promise<{ message: string }> => {
    return request<{ message: string }>(`/api/v1/reviewer/assignments/${id}/decline`, {
      method: "POST",
    });
  },

  submitReview: async (
    id: number | string,
    payload: SubmitReviewPayload
  ): Promise<{ message: string }> => {
    return request<{ message: string }>(`/api/v1/reviewer/assignments/${id}/submit`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

// ==========================================
// 7. EDITOR SUITE API
// ==========================================

export interface EditorialDecisionPayload {
  decision: "ACCEPT" | "REJECT" | "REVISION_REQUESTED";
  note?: string;
}

export const editorApi = {
  listSubmissions: async (
    status?: string,
    type?: string,
    page = 0,
    size = 20
  ): Promise<PageResult<Submission>> => {
    const query = new URLSearchParams();
    if (status && status !== "All") query.set("status", status);
    if (type && type !== "All") query.set("type", type);
    query.set("page", page.toString());
    query.set("size", size.toString());

    return request<PageResult<Submission>>(`/api/v1/editor/submissions?${query.toString()}`);
  },

  getSubmission: async (id: number | string): Promise<Submission> => {
    return request<Submission>(`/api/v1/editor/submissions/${id}`);
  },

  getReviewers: async (): Promise<AuthResponseData["user"][]> => {
    return request<AuthResponseData["user"][]>("/api/v1/editor/reviewers");
  },

  assignEditor: async (
    submissionId: number | string,
    editorId: number | string
  ): Promise<Submission> => {
    return request<Submission>(
      `/api/v1/editor/submissions/${submissionId}/assign-editor?editorId=${editorId}`,
      { method: "POST" }
    );
  },

  assignReviewer: async (
    submissionId: number | string,
    reviewerId: number | string,
    dueDate?: string
  ): Promise<{ message: string }> => {
    const query = new URLSearchParams({ reviewerId: reviewerId.toString() });
    if (dueDate) query.set("dueDate", dueDate);

    return request<{ message: string }>(
      `/api/v1/editor/submissions/${submissionId}/assign-reviewer?${query.toString()}`,
      { method: "POST" }
    );
  },

  makeDecision: async (
    submissionId: number | string,
    payload: EditorialDecisionPayload
  ): Promise<Submission> => {
    return request<Submission>(
      `/api/v1/editor/submissions/${submissionId}/decision`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  moveToCopyediting: async (submissionId: number | string): Promise<Submission> => {
    return request<Submission>(
      `/api/v1/editor/submissions/${submissionId}/copyediting`,
      { method: "POST" }
    );
  },

  scheduleForIssue: async (submissionId: number | string): Promise<Submission> => {
    return request<Submission>(
      `/api/v1/editor/submissions/${submissionId}/schedule`,
      { method: "POST" }
    );
  },

  publishSubmission: async (
    submissionId: number | string,
    issueId: number | string,
    doi?: string,
    pages?: string
  ): Promise<Submission> => {
    const query = new URLSearchParams({ issueId: issueId.toString() });
    if (doi) query.set("doi", doi);
    if (pages) query.set("pages", pages);

    return request<Submission>(
      `/api/v1/editor/submissions/${submissionId}/publish?${query.toString()}`,
      { method: "POST" }
    );
  },
};

// ==========================================
// 8. ADMIN SUITE API
// ==========================================

export interface DashboardStats {
  activeSubmissions: number;
  underReview: number;
  accepted: number;
  publishedArticles: number;
  activeReviewers: number;
  publishedIssues: number;
  registeredUsers: number;
}

export const adminApi = {
  getStats: async (): Promise<DashboardStats> => {
    return request<DashboardStats>("/api/v1/admin/stats");
  },

  listUsers: async (): Promise<AuthResponseData["user"][]> => {
    return request<AuthResponseData["user"][]>("/api/v1/admin/users");
  },

  updateUserRole: async (
    userId: number | string,
    role: string
  ): Promise<AuthResponseData["user"]> => {
    return request<AuthResponseData["user"]>(
      `/api/v1/admin/users/${userId}/role?role=${role}`,
      { method: "PUT" }
    );
  },

  updateUserStatus: async (
    userId: number | string,
    enabled: boolean
  ): Promise<AuthResponseData["user"]> => {
    return request<AuthResponseData["user"]>(
      `/api/v1/admin/users/${userId}/status?enabled=${enabled}`,
      { method: "PUT" }
    );
  },

  setCurrentIssue: async (issueId: number | string): Promise<IssueData> => {
    return request<IssueData>(`/api/v1/admin/issues/${issueId}/set-current`, {
      method: "PUT",
    });
  },

  createIssue: async (dto: Partial<IssueData>): Promise<IssueData> => {
    return request<IssueData>("/api/v1/admin/issues", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  updateIssue: async (
    issueId: number | string,
    dto: Partial<IssueData>
  ): Promise<IssueData> => {
    return request<IssueData>(`/api/v1/admin/issues/${issueId}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    });
  },

  createBoardMember: async (
    dto: Partial<BoardMember>
  ): Promise<BoardMember> => {
    return request<BoardMember>("/api/v1/admin/board-members", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  updateBoardMember: async (
    id: number | string,
    dto: Partial<BoardMember>
  ): Promise<BoardMember> => {
    return request<BoardMember>(`/api/v1/admin/board-members/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    });
  },

  deleteBoardMember: async (id: number | string): Promise<{ message: string }> => {
    return request<{ message: string }>(`/api/v1/admin/board-members/${id}`, {
      method: "DELETE",
    });
  },
};

export const filesApi = {
  uploadImage: async (
    file: File,
    folder: string = "gbjournal/images"
  ): Promise<{ url: string; publicId: string; format: string; width: number; height: number }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const token = getAccessToken();
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/files/upload-image`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Image upload failed" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return res.json();
  },
};

