const API_URL = import.meta.env.VITE_API_URL ?? '';
const TOKEN_KEY = 'tsea_token';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token) => {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, String(token).replace(/^Bearer\s+/i, ''));
};

export const clearStoredToken = () => localStorage.removeItem(TOKEN_KEY);

export const extractToken = (data) => {
  if (!data || typeof data !== 'object') return null;
  return (
    data.token ??
    data.accessToken ??
    data.access_token ??
    data.jwt ??
    data.data?.token ??
    data.data?.accessToken ??
    data.usuario?.token ??
    null
  );
};

export async function apiRequest(path, options = {}) {
  const token = getStoredToken();
  const headers = new Headers(options.headers ?? {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = /^https?:\/\//i.test(path) ? path : `${API_URL}${path}`;

  return fetch(url, {
    credentials: 'include',
    ...options,
    headers
  });
}

export async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
