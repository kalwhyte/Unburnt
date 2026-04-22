import { useState } from "react";
import { login } from "../services/api/auth";
import { router } from "expo-router";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError("");
      const data = await login(email, password);
      console.log("Login successful:", data);
      router.replace('/(tabs)/dashboard');
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
}