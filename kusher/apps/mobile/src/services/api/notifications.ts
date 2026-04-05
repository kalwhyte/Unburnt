import { api } from "./client";

export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

export const markOneRead = async (id: string) => {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data;
};

export const markAllRead = async () => {
  const res = await api.patch("/notifications/read-all");
  return res.data;
};

export const deleteNotification = async (id: string) => {
  await api.delete(`/notifications/${id}`);
};

export const getNotificationPreferences = async () => {
  const res = await api.get("/notifications/preferences");
  return res.data;
};

export const updateNotificationPreferences = async (data: {
  morningReminder?: boolean;
  triggerWindowReminder?: boolean;
  streakUpdates?: boolean;
  milestoneAlerts?: boolean;
  missedLogReminders?: boolean;
}) => {
  const res = await api.patch("/notifications/preferences", data);
  return res.data;
};