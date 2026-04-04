import axios, { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../../store/useAuthStore";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});