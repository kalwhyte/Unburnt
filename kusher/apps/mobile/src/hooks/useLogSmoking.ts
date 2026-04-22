import { useRefreshStore } from "@/store/useRefreshStore";
import { createSmokingLog } from "../services/api/smokingLogs";
import { useState } from "react";

export function useLogSmoking() {
  const [loading, setLoading] = useState(false);
  const triggerDashboardRefresh = useRefreshStore((state) => state.triggerDashboardRefresh);

  const log = async (payload: {
    count: number;
    context: string;
    feeling: string;
    regret: boolean;
    notes: string;
  }) => {
    setLoading(true);
    try {
      await createSmokingLog({
        quantity: payload.count,
        mood:       payload.feeling,
        note:       payload.notes,
        loggedAt:   new Date().toISOString(),
      });
      triggerDashboardRefresh();
    } finally {
      setLoading(false);
    }
  };

  return { log, loading };
}