import { api } from "./client";

export const getProfile = async () => {
  const res = await api.get("/profiles/me");
  return res.data;
};

export const updateProfile = async (data: {
  bio?: string;
  smokerSince?: string;
  cigarettesPerDay?: number;
  packCost?: number;
  yearsSmoking?: number;
  quitDate?: string;
  timezone?: string;
  displayName?: string;
  avatarUrl?: string;
}) => {
  const res = await api.put("/profiles/update", data);
  return res.data;
};

export const deleteAccount = async () => {
  const res = await api.delete("/profiles/delete");
  return res.data;
};

export const createProfile = async (data: {
  displayName: string;
  avatarUrl?: string;
}) => {
  const res = await api.post("/profiles/me/init", data);
  return res.data;
};
