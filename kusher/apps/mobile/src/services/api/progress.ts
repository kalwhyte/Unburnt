import { api } from "./client";

export const getProgressStats = async () => {
  const res = await api.get("/progress/stats");
  return res.data;
};

export const getMilestones = async () => {
  const res = await api.get("/progress/milestones");
  return res.data;
};

export const getHealthImprovements = async () => {
  const res = await api.get("/progress/health");
  return res.data;
};

export const getSavingsData = async () => {
  const res = await api.get("/progress/savings");
  return res.data;
};
