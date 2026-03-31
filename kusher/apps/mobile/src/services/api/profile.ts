import { api } from "./client";

export const getProfile = async () => {
  const res = await api.get("/profile");
  return res.data;
};

export const updateProfile = async (data: {
  displayName?: string;
  avatarUrl?: string;
}) => {
  const res = await api.patch("/profile", data);
  return res.data;
};

export const deleteAccount = async () => {
  const res = await api.delete("/profile");
  return res.data;
};
