import { useEffect } from 'react';
// @ts-ignore
import Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

export function useNotificationObserver() {
  const router = useRouter();

  useEffect(() => {
    let foregroundSub: Notifications.Subscription
    let responseSub: Notifications.Subscription

    try {
      foregroundSub = Notifications.addNotificationReceivedListener((notification) => {
        console.log('Notification received in foreground:', notification)
      })

      responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as Record<string, any> | undefined
        if (data?.screen) router.push(data.screen as never)
      })
      } catch (_) {
        console.error('Failed to navigate on notification tap:', _);
      }

    return () => {
      try {
        foregroundSub?.remove();
        responseSub?.remove();
      } catch (_) {}
    };
  }, []);
}
