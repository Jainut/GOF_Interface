const API_URL = import.meta.env.VITE_API_URL ?? '';
const TOKEN_KEY = 'tsea_token';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredToken = () => localStorage.removeItem(TOKEN_KEY);

export async function apiRequest(path, options = {}) {
  const token = getStoredToken();
  const headers = new Headers(options.headers ?? {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(`${API_URL}${path}`, {
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
