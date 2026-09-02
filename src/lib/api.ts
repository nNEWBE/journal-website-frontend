import { type Role, type Article, type Submission, type BoardMember } from "./data";
import { handleSessionExpired, parseCookie, setCookie, deleteCookie } from "./auth";
import { getBackendUrl } from "./backend-url";

export const API_BASE_URL = getBackendUrl();

export function clearTokens(): void {
  deleteCookie("access_token");
  deleteCookie("refresh_token");
  deleteCookie("gb_access_token");
  deleteCookie("gb_refresh_token");
}

export function setTokens(access: string, refresh?: string): void {
  if (!access) return;
  setCookie("access_token", access, 1);
  if (refresh) {
    setCookie("refresh_token", refresh, 7);
  }
}

export function getAccessToken(): string | null {
  return parseCookie("access_token");
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function silentlyRefreshToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const isBrowser = typeof window !== "undefined";

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // In browser, route through secure Next.js backend proxy which automatically injects HttpOnly cookie.
  // On the server-side (SSR), call Spring Boot directly.
  let targetUrl: string;
  if (isBrowser) {
    const cleanEndpoint = endpoint.startsWith("/api/v1")
      ? endpoint.substring("/api/v1".length)
      : endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;
    targetUrl = `/api/backend${cleanEndpoint}`;
  } else {
    targetUrl = `${API_BASE_URL}${endpoint}`;
  }

  let res: Response;
  try {
    res = await fetch(targetUrl, {
      ...options,
      headers,
    });
  } catch (networkErr: any) {
    // Network-level failure (ECONNREFUSED, DNS, offline, etc.)
    // Do NOT trigger session expiry — this is a connectivity issue, not an auth issue.
    throw new Error(
      "Unable to reach the server. Please check your connection and try again."
    );
  }

  // On 401 in browser: attempt silent refresh once and retry the request
  if (!res.ok) {
    if (res.status === 401 && isBrowser && !endpoint.includes("/login") && !endpoint.includes("/refresh")) {
      const refreshed = await silentlyRefreshToken();
      if (refreshed) {
        try {
          res = await fetch(targetUrl, {
            ...options,
            headers,
          });
        } catch {
          throw new Error(
            "Unable to reach the server. Please check your connection and try again."
          );
        }
      }
    }

    if (!res.ok) {
      // Only treat 401 as session expiry — NOT 503 (backend down)
      if (
        res.status === 401 &&
        isBrowser &&
        !endpoint.includes("/login") &&
        !endpoint.includes("/refresh")
      ) {
        handleSessionExpired();
      }

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
  }

  // If response has no content (204 No Content), return empty object
  if (res.status === 204) {
    return {} as T;
  }

  return (await res.json()) as T;
}


// ==========================================
// 1. AUTH API (SECURE HTTPONLY ENDPOINTS)
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
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
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
    clearTokens();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Invalid credentials");
    }
    return json;
  },

  register: async (data: RegisterPayload): Promise<AuthResponseData> => {
    clearTokens();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Registration failed");
    }
    return json;
  },

  getMe: async (): Promise<AuthResponseData["user"]> => {
    const res = await fetch("/api/auth/me", {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Unauthorized");
    }

    const json = await res.json();
    return json.user;
  },

  logout: async (): Promise<void> => {
    clearTokens();
    await fetch("/api/auth/logout", {
      method: "POST",
    });
  },

  refreshToken: async (): Promise<{ success: boolean; accessToken: string }> => {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
    });
    if (!res.ok) {
      throw new Error("Failed to refresh token");
    }
    return res.json();
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
  volumeLabel?: string;
  issueLabel?: string;
  volume?: number;
  number?: number;
  title?: string;
  description?: string;
  status?: string;
  month?: string;
  theme?: string;
  articleCount: number;
  articlesCount?: number;
  current: boolean;
  isCurrent?: boolean;
  coverImageUrl?: string;
  editorNote?: string;
  articles?: Article[];
  articlesByType?: Record<string, Article[]>;
}

export const issuesApi = {
  list: async (): Promise<IssueData[]> => {
    return request<IssueData[]>("/api/v1/issues");
  },

  getAll: async (): Promise<IssueData[]> => {
    return request<IssueData[]>("/api/v1/issues");
  },

  getCurrent: async (): Promise<IssueData> => {
    return request<IssueData>("/api/v1/issues/current");
  },

  getByKey: async (issueKey: string): Promise<IssueData> => {
    return request<IssueData>(`/api/v1/issues/${issueKey}`);
  },
};

export const boardApi = {
  getAll: async (): Promise<BoardMember[]> => {
    return request<BoardMember[]>("/api/v1/editorial-board");
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



export interface MailTemplateItem {
  key: string;
  name: string;
  subject: string;
  body: string;
}

export const adminApi = {
  getStats: async (): Promise<DashboardStats> => {
    return request<DashboardStats>("/api/v1/admin/stats");
  },

  listUsers: async (): Promise<AuthResponseData["user"][]> => {
    return request<AuthResponseData["user"][]>("/api/v1/admin/users");
  },

  createUser: async (payload: {
    fullName: string;
    email: string;
    password?: string;
    role: string;
    title?: string;
    department?: string;
    institution?: string;
    orcid?: string;
  }): Promise<AuthResponseData["user"]> => {
    return request<AuthResponseData["user"]>("/api/v1/admin/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateUser: async (
    userId: number | string,
    payload: {
      fullName?: string;
      role?: string;
      title?: string;
      department?: string;
      institution?: string;
      orcid?: string;
      password?: string;
      enabled?: boolean;
    }
  ): Promise<AuthResponseData["user"]> => {
    return request<AuthResponseData["user"]>(`/api/v1/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteUser: async (userId: number | string): Promise<{ message: string }> => {
    return request<{ message: string }>(`/api/v1/admin/users/${userId}`, {
      method: "DELETE",
    });
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

  getAllSubmissions: async (params?: {
    status?: string;
    type?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: any[]; totalElements: number; totalPages: number }> => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.type) query.set("type", params.type);
    if (params?.page !== undefined) query.set("page", params.page.toString());
    if (params?.size !== undefined) query.set("size", params.size.toString());
    const queryString = query.toString() ? `?${query.toString()}` : "";
    return request<any>(`/api/v1/admin/submissions${queryString}`);
  },

  sendMail: async (payload: {
    audience: "INDIVIDUAL" | "ALL_AUTHORS" | "ALL_REVIEWERS" | "ALL_EDITORS" | "ALL_USERS" | string;
    recipientEmail?: string;
    subject: string;
    messageBody: string;
  }): Promise<{ success: boolean; sentCount: number; audience: string; subject: string }> => {
    return request<any>("/api/v1/admin/mail/send", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getMailTemplates: async (): Promise<MailTemplateItem[]> => {
    return request<MailTemplateItem[]>("/api/v1/admin/mail/templates");
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
    file: File | Blob,
    folder: string = "gbjournal/images"
  ): Promise<{ url: string; publicId: string; format: string; width: number; height: number }> => {
    const formData = new FormData();
    if (file instanceof File) {
      formData.append("file", file);
    } else {
      formData.append("file", file, `image-${Date.now()}.jpg`);
    }
    formData.append("folder", folder);

    const isBrowser = typeof window !== "undefined";
    const targetUrl = isBrowser
      ? "/api/backend/files/upload-image"
      : `${API_BASE_URL}/api/v1/files/upload-image`;

    const res = await fetch(targetUrl, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Image upload failed" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return res.json();
  },
};

export const userApi = {
  getProfile: async (): Promise<any> => {
    return request<any>("/api/v1/auth/me");
  },

  updateProfile: async (dto: Record<string, any>): Promise<any> => {
    return request<any>("/api/v1/auth/profile", {
      method: "PUT",
      body: JSON.stringify({
        fullName: dto.name || dto.fullName,
        title: dto.title || dto.academicTitle,
        department: dto.department,
        institution: dto.institution,
        country: dto.country,
        orcid: dto.orcid,
        researchInterests: Array.isArray(dto.researchInterests)
          ? dto.researchInterests.join(", ")
          : dto.researchInterests,
        avatarUrl: dto.avatar || dto.avatarUrl,
      }),
    });
  },

  uploadAvatar: async (
    file: File | Blob
  ): Promise<{ avatarUrl: string;[key: string]: any }> => {
    const formData = new FormData();
    if (file instanceof File) {
      formData.append("file", file);
    } else {
      formData.append("file", file, `avatar-${Date.now()}.jpg`);
    }

    // Use the dedicated avatar upload proxy route (NOT the generic catch-all).
    // The generic proxy at /api/backend/[...path] re-forwards multipart as
    // arrayBuffer which can corrupt the boundary — this dedicated route uses
    // req.formData() + reconstructs FormData properly.
    let res = await fetch("/api/auth/upload-avatar", {
      method: "POST",
      body: formData,
      // Do NOT set Content-Type — browser auto-sets multipart/form-data + boundary
    });

    if (!res.ok && res.status === 401) {
      const refreshed = await silentlyRefreshToken();
      if (refreshed) {
        res = await fetch("/api/auth/upload-avatar", {
          method: "POST",
          body: formData,
        });
      }
    }

    if (!res.ok) {
      if (res.status === 401 && typeof window !== "undefined") {
        handleSessionExpired();
      }
      const error = await res
        .json()
        .catch(() => ({ message: "Avatar upload failed" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return res.json();
  },

  changePassword: async (dto: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
    return request<{ message: string }>("/api/v1/auth/change-password", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },
};

// ==========================================
// 8. PAGE CONTENT & CMS API
// ==========================================

export interface PageContentDTO {
  id?: number;
  pageKey: string;
  sectionKey: string;
  title: string;
  subtitle?: string;
  content?: string;
  metaJson?: string;
  displayOrder: number;
  published: boolean;
  lastUpdatedBy?: string;
  updatedAt?: string;
}

export const contentApi = {
  getPublished: async (pageKey: string): Promise<PageContentDTO[]> => {
    return request<PageContentDTO[]>(`/api/v1/content/${pageKey}`);
  },

  getAllPublished: async (): Promise<Record<string, PageContentDTO[]>> => {
    return request<Record<string, PageContentDTO[]>>("/api/v1/content/all");
  },

  getAdminContent: async (pageKey: string): Promise<PageContentDTO[]> => {
    return request<PageContentDTO[]>(`/api/v1/admin/content/${pageKey}`);
  },

  getAdminAllContent: async (): Promise<Record<string, PageContentDTO[]>> => {
    return request<Record<string, PageContentDTO[]>>("/api/v1/admin/content/all");
  },

  updateSection: async (
    pageKey: string,
    sectionKey: string,
    payload: Partial<PageContentDTO>
  ): Promise<PageContentDTO> => {
    return request<PageContentDTO>(`/api/v1/admin/content/${pageKey}/${sectionKey}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  createSection: async (payload: PageContentDTO): Promise<PageContentDTO> => {
    return request<PageContentDTO>("/api/v1/admin/content/sections", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  deleteSection: async (id: number): Promise<{ message: string }> => {
    return request<{ message: string }>(`/api/v1/admin/content/sections/${id}`, {
      method: "DELETE",
    });
  },

  resetDefaults: async (pageKey?: string): Promise<{ message: string }> => {
    const url = pageKey
      ? `/api/v1/admin/content/reset-defaults?pageKey=${encodeURIComponent(pageKey)}`
      : "/api/v1/admin/content/reset-defaults";
    return request<{ message: string }>(url, {
      method: "POST",
    });
  },
};

// ==========================================
// 9. NAVIGATION & MENU API (DATABASE BACKED)
// ==========================================

export interface NavSubItemDTO {
  id?: number;
  clientId?: string;
  label: string;
  href: string;
  description?: string;
  iconName?: string;
  displayOrder?: number;
  enabled?: boolean;
}

export interface NavItemDTO {
  id?: number;
  clientId?: string;
  label: string;
  href: string;
  dropdownHeader?: string;
  footerLabel?: string;
  footerHref?: string;
  displayOrder?: number;
  openInNewTab?: boolean;
  enabled?: boolean;
  dropdown?: NavSubItemDTO[];
}

export const navigationApi = {
  getPublished: async (): Promise<NavItemDTO[]> => {
    return request<NavItemDTO[]>("/api/v1/navigation");
  },

  getAllAdmin: async (): Promise<NavItemDTO[]> => {
    return request<NavItemDTO[]>("/api/v1/admin/navigation");
  },

  saveBulk: async (items: NavItemDTO[]): Promise<NavItemDTO[]> => {
    return request<NavItemDTO[]>("/api/v1/admin/navigation/bulk", {
      method: "PUT",
      body: JSON.stringify(items),
    });
  },

  resetDefaults: async (): Promise<NavItemDTO[]> => {
    return request<NavItemDTO[]>("/api/v1/admin/navigation/reset-defaults", {
      method: "POST",
    });
  },
};
