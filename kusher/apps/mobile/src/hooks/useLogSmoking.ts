import { createSmokingLog } from "../services/api/smokingLogs";
import { useState } from "react";

export function useLogSmoking() {
  const [loading, setLoading] = useState(false);

  const log = async (payload: any) => {
    setLoading(true);
    try {
      await createSmokingLog(payload);
    } finally {
      setLoading(false);
    }
  };

  return { log, loading };
}