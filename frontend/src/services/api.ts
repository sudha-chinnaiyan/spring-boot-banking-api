import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let logoutCallback: (() => void) | null = null;

export const registerLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns 401 Unauthorized, automatically trigger logout.
    if (error.response && error.response.status === 401) {
      if (logoutCallback) {
        logoutCallback();
      }
    }
    return Promise.reject(error);
  }
);
