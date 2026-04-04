import { api } from "./client";

export const createSmokingLog = async (data: any) => {
  const res = await api.post("/smoking-logs", data);
  return res.data;
};export const getSmokingLogs = async () => {
  const res = await api.get("/smoking-logs");
  return res.data;
};

export const dailySummary = async () => {
  const res = await api.get("/smoking-logs/summary/daily");
  return res.data;
};

export const weeklySummary = async () => {
  const res = await api.get("/smoking-logs/summary/weekly");
  return res.data;
};

export const getSmokingLog = async (id: string) => {
  const res = await api.get(`/smoking-logs/${id}`);
  return res.data;
};

// export const getSmokingStats = async () => {
//   const res = await api.get("/smoking-logs/stats");
//   return res.data;
// };

export const deleteSmokingLog = async (id: string) => {
  const res = await api.delete(`/smoking-logs/${id}`);
  return res.data;
};
