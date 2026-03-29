import axios from 'axios';
import type { AxiosError } from 'axios';
import type { AppError } from '../types/product';

const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) ?? '/',
});

apiClient.interceptors.request.use((config) => {
  // Attach auth headers here when needed
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    const appError: AppError = {
      message: (error.message as string) ?? 'An unexpected error occurred',
      status: error.response?.status,
      code: error.code,
    };
    return Promise.reject(appError);
  }
);

export default apiClient;
