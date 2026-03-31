import { useState } from "react";
import { register as registerApi } from "../services/api/auth";
import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "expo-router";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  const register = async (payload: any) => {
    try {
      setLoading(true);
      setError("");

      const data = await registerApi(payload);

      if (data.access_token) {
        setAuth(data.user, data.access_token);
        // Navigate to onboarding after successful registration
        router.replace('/(onboarding)/start');
      }
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}
