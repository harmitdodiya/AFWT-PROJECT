import axios from 'axios';

// This is the Communication Layer described in the SRS. The rest of the app
// currently talks to src/api/mockApi.js (an in-memory simulation) so the
// portal is fully demonstrable without a live server. When a real backend is
// available, point VITE_API_BASE_URL at it and swap the imports in the
// Redux thunks from './mockApi' to an equivalent module built on this client.
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('salon_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('salon_auth_token');
      localStorage.removeItem('salon_auth_user');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
