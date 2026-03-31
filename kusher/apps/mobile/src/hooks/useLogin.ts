import { useState } from "react";
import { login } from "../services/api/auth";
import { useAuthStore } from "../store/useAuthStore";
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError("");

      const data = await login(email, password);

      console.log("Login successful:", data);
      if (data.access_token) {
        router.replace('/(tabs)/dashboard');
        setAuth(data.user, data.access_token);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
}