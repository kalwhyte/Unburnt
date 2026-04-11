import axios, { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import { Platform } from 'react-native'

const getBaseUrl = () => {
  if (__DEV__) {
    return Platform.select({
      android: 'http://10.0.2.2:3000',  // Android emulator → your machine
      ios: 'http://localhost:3000',
      default: 'http://localhost:3000',
    });
  }
  return process.env.EXPO_PUBLIC_API_URL;
};

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;

  console.log('token', token)
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});