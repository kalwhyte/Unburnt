import { api } from "./client";

export const getDashboard = async () => {
  const res = await api.get("/progress/dashboard");
  return res.data;
};

export const getStreaks = async () => {
  const res = await api.get("/progress/streak");
  return res.data;
};

export const getSavingsData = async () => {
  const res = await api.get("/progress/money-saved");
  return res.data;
};

export const getHealthTimeline = async () => {
  const res = await api.get("/progress/health-timeline");
  return res.data;
};

export const getWeeklySummary = async () => {
  const res = await api.get("/progress/weekly-summary");
  return res.data;
};

export const processMilestones = (data: any) => {
  // Process raw milestone data into a format suitable for the UI
  return data.milestones.map((m: any) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    achievedAt: new Date(m.achievedAt),
  }));
};

export const processHealthTimeline = (data: any) => {
  // Process raw health timeline data into a format suitable for the UI
  return data.timeline.map((entry: any) => ({
    id: entry.id,
    healthAspect: entry.healthAspect,
    improvement: entry.improvement,
    timestamp: new Date(entry.timestamp),
  }));
};