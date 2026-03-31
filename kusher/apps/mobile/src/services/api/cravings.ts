import { api } from "./client";

export const createCravingLog = async (data: {
  intensity: number;
  triggerId?: string;
  notes?: string;
  timestamp?: string;
}) => {
  const res = await api.post("/cravings", data);
  return res.data;
};

export const getCravingStats = async () => {
  const res = await api.get("/cravings/stats");
  return res.data;
};

export const getTriggers = async () => {
  const res = await api.get("/cravings/triggers");
  return res.data;
};

export const resolveCraving = async (id: string, wasSuccessful: boolean) => {
  const res = await api.patch(`/cravings/${id}/resolve`, { wasSuccessful });
  return res.data;
};

export const logCravingOutcome = async (id: string, wasSuccessful: boolean) => {
  const res = await api.post(`/cravings/${id}/outcome`, { wasSuccessful });
  return res.data;
};

export const getCravingLogs = async () => {
  const res = await api.get("/cravings");
  return res.data;
};