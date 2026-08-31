const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface FileMetadata {
  fileType: string;
  fileSize: number;
  mimeType: string;
  originalName: string;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileMetadata: FileMetadata;
  createdAt: string;
}

export interface JobDescription {
  id: string;
  userId: string;
  title: string;
  company: string;
  description: string;
  createdAt: string;
}

export interface SectionFeedback {
  summary?: string;
  experience?: string;
  education?: string;
  skills?: string;
}

export interface ResumeAnalysis {
  id: string;
  userId: string;
  resumeId: string | { _id: string; fileName: string };
  jobDescriptionId?: string | { _id: string; title: string; company: string };
  overallScore: number;
  atsScore: number;
  jobMatchScore: number | null;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  skills: string[];
  missingSkills: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
  sectionFeedback: SectionFeedback;
  createdAt: string;
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

function authHeaders(token: string | null, extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    ...extra,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

export const api = {
  // ── Auth ──

  async register(data: { email: string; name: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  async getMe(): Promise<User> {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: authHeaders(token),
    });
    return handleResponse<User>(response);
  },

  // ── Resumes ──

  async uploadResume(file: File): Promise<Resume> {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/api/resumes`, {
      method: 'POST',
      headers: authHeaders(token),
      body: formData,
    });
    return handleResponse<Resume>(response);
  },

  async getResume(id: string): Promise<Resume> {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/api/resumes/${id}`, {
      headers: authHeaders(token),
    });
    return handleResponse<Resume>(response);
  },

  async getAllResumes(): Promise<Resume[]> {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/api/resumes`, {
      headers: authHeaders(token),
    });
    return handleResponse<Resume[]>(response);
  },

  // ── Job Descriptions ──

  async createJobDescription(data: { title: string; company: string; description: string }): Promise<JobDescription> {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/api/job-descriptions`, {
      method: 'POST',
      headers: authHeaders(token, { 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    });
    return handleResponse<JobDescription>(response);
  },

  async getJobDescription(id: string): Promise<JobDescription> {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/api/job-descriptions/${id}`, {
      headers: authHeaders(token),
    });
    return handleResponse<JobDescription>(response);
  },

  async getAllJobDescriptions(): Promise<JobDescription[]> {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/api/job-descriptions`, {
      headers: authHeaders(token),
    });
    return handleResponse<JobDescription[]>(response);
  },

  // ── Analyses ──

  async analyzeResume(data: {
    resumeId: string;
    jobDescriptionId?: string;
  }): Promise<ResumeAnalysis> {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/api/analyses`, {
      method: 'POST',
      headers: authHeaders(token, { 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    });
    return handleResponse<ResumeAnalysis>(response);
  },

  async getAnalysis(id: string): Promise<ResumeAnalysis> {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/api/analyses/${id}`, {
      headers: authHeaders(token),
    });
    return handleResponse<ResumeAnalysis>(response);
  },

  async getAllAnalyses(): Promise<ResumeAnalysis[]> {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/api/analyses`, {
      headers: authHeaders(token),
    });
    return handleResponse<ResumeAnalysis[]>(response);
  },
};
