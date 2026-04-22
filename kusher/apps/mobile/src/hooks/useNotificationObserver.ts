import { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { getNotifications, markOneRead, markAllRead, deleteNotification } from '@/services/api/notifications';

export function useNotificationFeed() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      setNotifications(res.data ?? []);
      setUnreadCount(res.unreadCount ?? 0);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const readOne = async (id: string) => {
    await markOneRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const readAll = async () => {
    await markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const remove = async (id: string) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    if (!hasHydrated || !token) return;

    fetchNotifications();

    // Refetch when app returns to foreground
    const subscription = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        if (state === 'active') fetchNotifications();
      },
    );

    // Poll every 30s to catch craving notifications
    const interval = setInterval(fetchNotifications, 60_000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, [hasHydrated, token]);

  return { notifications, unreadCount, loading, refresh: fetchNotifications, readOne, readAll, remove };
}