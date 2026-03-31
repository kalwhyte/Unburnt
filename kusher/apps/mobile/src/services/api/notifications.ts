import { api } from "./client";

export const registerPushToken = async (token: string) => {
  const res = await api.post("/notifications/register", { token });
  return res.data;
};

export const getNotificationSettings = async () => {
  const res = await api.get("/notifications/settings");
  return res.data;
};

export const updateNotificationSettings = async (settings: {
  remindersEnabled: boolean;
  milestonesEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}) => {
  const res = await api.patch("/notifications/settings", settings);
  return res.data;
};
