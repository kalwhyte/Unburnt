import { useState } from "react";
import { register as registerApi } from "../services/api/auth";
import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "@/store/onboardingStore";

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
        useOnboardingStore.getState().reset(); // Clear onboarding data on new registration
        setAuth(data.user, data.access_token);
        router.replace('/(onboarding)/welcome');
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
