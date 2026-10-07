
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Client-side auth helper
export function setAuthToken(token: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `techvora_token=${token}; path=/; max-age=86400`;
  }
}

export function getAuthToken() {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )techvora_token=([^;]+)'));
    if (match) return match[2];
  }
  return null;
}

export function getAuthHeader() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function removeAuthToken() {
  if (typeof document !== 'undefined') {
    document.cookie = 'techvora_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }
}

// Auth API Endpoints
export async function forgotPassword(email: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to send OTP');
  }
  return res.json();
}

export async function verifyOtp(email: string, otp: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Invalid or expired OTP');
  }
  return res.json();
}

export async function resetPassword(email: string, otp: string, newPassword: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, newPassword })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to reset password');
  }
  return res.json();
}

// User API Endpoints
export async function getUserProfile(token: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function getUserNotifications(token: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  imageAltText?: string;
  subcategory?: string;
  autoToc?: boolean;
  status: string;
  readingTime?: number;
  authorName: string;
  categoryName?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  isFeatured?: boolean;
  allowComments?: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export async function fetchPublishedArticles(page = 0, size = 10): Promise<PaginatedResponse<Article>> {
  const res = await fetch(`${API_BASE_URL}/blog?page=${page}&size=${size}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch articles');
  }

  return res.json();
}

export async function fetchArticleBySlug(slug: string): Promise<Article> {
  const res = await fetch(`${API_BASE_URL}/blog/${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Article not found');
    }
    throw new Error('Failed to fetch article');
  }

  return res.json();
}

export interface RoadmapNode {
  id: string;
  title: string;
  description?: string;
  orderIndex: number;
  linkedArticleSlug?: string;
}

export interface Roadmap {
  id: string;
  title: string;
  slug: string;
  description: string;
  nodes: RoadmapNode[];
}

export async function fetchRoadmaps(): Promise<Roadmap[]> {
  const res = await fetch(`${API_BASE_URL}/roadmaps`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch roadmaps');
  return res.json();
}

export interface InterviewQuestion {
  id: string;
  title: string;
  slug: string;
  questionContent: string;
  answerContent: string;
  difficultyLevel: string;
}

export async function fetchInterviewQuestions(): Promise<InterviewQuestion[]> {
  const res = await fetch(`${API_BASE_URL}/interviews`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch interview questions');
  return res.json();
}

export interface AnalyticsData {
  totalUsers: number;
  totalArticles: number;
  activeRoadmaps: number;
  userGrowthByMonth: Record<string, number>;
  pageViewsByMonth: Record<string, number>;
}

export async function fetchAnalytics(token: string): Promise<AnalyticsData> {
  const res = await fetch(`${API_BASE_URL}/admin/analytics`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export interface AuditLog {
  id: string;
  username: string;
  action: string;
  entityId: string;
  details: string;
  createdAt: string;
}

export async function fetchAuditLogs(token: string, page = 0, size = 20): Promise<PaginatedResponse<AuditLog>> {
  const res = await fetch(`${API_BASE_URL}/admin/audit-logs?page=${page}&size=${size}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function searchArticles(query: string, page = 0, size = 10): Promise<PaginatedResponse<Article>> {
  const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) throw new Error('Failed to search articles');
  return res.json();
}

export async function addBookmark(articleId: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/bookmarks/${articleId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to add bookmark');
}

export async function removeBookmark(articleId: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/bookmarks/${articleId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to remove bookmark');
}

export async function updateReadingProgress(articleId: string, percentage: number, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/progress/${articleId}?percentage=${percentage}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to update progress');
}
