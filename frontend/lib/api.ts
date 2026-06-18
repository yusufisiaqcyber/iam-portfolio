import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Attach JWT for admin requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Types ────────────────────────────────────────────────────
export interface Project {
  id: number;
  title: string;
  description: string;
  long_description?: string;
  tech_stack: string[];
  github_url?: string;
  demo_url?: string;
  image_url?: string;
  featured: boolean;
  created_at: string;
}

export interface Writeup {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  tags: string[];
  published: boolean;
  published_at: string;
  created_at: string;
}

// ─── Public APIs ──────────────────────────────────────────────
export const getProjects = () => api.get<Project[]>('/projects').then(r => r.data);
export const getProject = (id: number) => api.get<Project>(`/projects/${id}`).then(r => r.data);
export const getWriteups = () => api.get<Writeup[]>('/writeups').then(r => r.data);
export const getWriteup = (slug: string) => api.get<Writeup>(`/writeups/${slug}`).then(r => r.data);
export const subscribe = (email: string, name?: string) => api.post('/subscribers', { email, name }).then(r => r.data);

// ─── Admin APIs ───────────────────────────────────────────────
export const adminLogin = (username: string, password: string) =>
  api.post('/auth/login', { username, password }).then(r => r.data);

export const verifyToken = () => api.get('/auth/verify').then(r => r.data);

// Projects
export const createProject = (data: Partial<Project>) => api.post('/projects', data).then(r => r.data);
export const updateProject = (id: number, data: Partial<Project>) => api.put(`/projects/${id}`, data).then(r => r.data);
export const deleteProject = (id: number) => api.delete(`/projects/${id}`).then(r => r.data);

// Writeups
export const getAllWriteups = () => api.get<Writeup[]>('/writeups/all').then(r => r.data);
export const createWriteup = (data: Partial<Writeup>) => api.post('/writeups', data).then(r => r.data);
export const updateWriteup = (id: number, data: Partial<Writeup>) => api.put(`/writeups/${id}`, data).then(r => r.data);
export const deleteWriteup = (id: number) => api.delete(`/writeups/${id}`).then(r => r.data);

// Subscribers
export const getSubscribers = () => api.get('/subscribers').then(r => r.data);

export default api;
