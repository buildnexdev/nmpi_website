import axios from 'axios';
import { Language, translate } from '../context/LanguageContext';

/** In dev, use same-origin `/api` via Vite proxy unless VITE_API_URL is set. */
export const API_ORIGIN = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '' : 'http://localhost:5000')
).replace(/\/$/, '');
export const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:3001';

export const TOKEN_KEY = 'nmpi_member_token';
export const USER_KEY = 'nmpi_member_user';

export const apiClient = axios.create({ baseURL: `${API_ORIGIN}/api` });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new Event('nmpi:session-expired'));
    }
    return Promise.reject(error);
  }
);

function storedLang(): Language {
  return localStorage.getItem('nmpi_lang') === 'en' ? 'en' : 'ta';
}

export function errorMessage(err: any, fallback?: string): string {
  if (!err?.response) return translate(storedLang(), 'errors.network');
  return err.response?.data?.message || (fallback ?? translate(storedLang(), 'errors.generic'));
}

/** Always return an array so list pages never crash on `.length`. */
export function asArray<T = any>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === 'object') {
    const o = value as Record<string, unknown>;
    if (Array.isArray(o.items)) return o.items as T[];
    if (Array.isArray(o.rows)) return o.rows as T[];
    if (Array.isArray(o.data)) return o.data as T[];
  }
  return [];
}

export function mediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}

/** Downloads an authenticated or token-protected file (e.g. the ID card PDF) and saves it. */
export async function downloadFile(url: string, fallbackName: string) {
  let res;
  try {
    res = await apiClient.get(url, { responseType: 'blob' });
  } catch (err: any) {
    if (err?.response?.data instanceof Blob) {
      try {
        err.response.data = JSON.parse(await err.response.data.text());
      } catch {
        /* keep original */
      }
    }
    throw err;
  }
  const disposition = String(res.headers['content-disposition'] || '');
  const match = disposition.match(/filename="?([^"]+)"?/);
  const href = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = href;
  a.download = match?.[1] || fallbackName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

export function formatDate(value?: string | null, lang: 'ta' | 'en' = 'en', withTime = false): string {
  if (!value) return '';
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

export function formatTime(value?: string | null): string {
  if (!value) return '';
  const [h, m] = value.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m || 0);
  return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

/** Pick the Tamil field when Tamil is active and it has content, otherwise the English one. */
export function pick(item: any, field: string, lang: 'ta' | 'en'): string {
  if (!item) return '';
  return (lang === 'ta' && item[`${field}_ta`]) || item[field] || '';
}
