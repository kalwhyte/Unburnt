import { useState, useEffect } from 'react';
// import { Platform } from 'react-native';
// import { useRouter } from 'expo-router';
import { getNotifications, markOneRead, markAllRead, deleteNotification } from '@/services/api/notifications';

export function useNotificationFeed() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // const router = useRouter();

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
    fetchNotifications();
  }, []);

  // useEffect(() => {
  //   if (Platform.OS === 'web') return;
  //   let foregroundSub: any;
  //   let responseSub: any;

  //   const setup = async () => {
  //     try {
  //       const Notifications = await import('expo-notifications');
  //       foregroundSub = Notifications.addNotificationReceivedListener((notification) => {
  //         console.log('Notification received in foreground:', notification);
  //       });

  //       responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
  //         const data = response.notification.request.content.data as Record<string, any> | undefined;
  //         if (data?.screen) router.push(data.screen as never);
  //       });
  //     } catch (error) {
  //       console.error('Failed to set up notification listeners:', error);
  //     }
  //   };

    // try {
    //   foregroundSub = Notifications.addNotificationReceivedListener((notification) => {
    //     console.log('Notification received in foreground:', notification)
    //   })

    //   responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
    //     const data = response.notification.request.content.data as Record<string, any> | undefined
    //     if (data?.screen) router.push(data.screen as never)
    //   })
    //   } catch (_) {
    //     console.error('Failed to navigate on notification tap:', _);
    //   }

    return { notifications, unreadCount, loading, refresh: fetchNotifications, readOne, readAll, remove };
}
