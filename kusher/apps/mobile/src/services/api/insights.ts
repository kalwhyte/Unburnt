import { api } from "./client";

export const getInsightsSummary = async () => {
  const res = await api.get("/insights/summary");
  return res.data;
};

export const getDailyCravings = async () => {
  const res = await api.get("/cravings/summary/daily");
  return res.data;
};