import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import * as Notifications from 'expo-notifications'
import { useRouter } from 'expo-router'
import { Platform } from 'react-native'

// Safe OneSignal import — won't crash if native module isn't linked
let OneSignal: any = null
try {
  OneSignal = require('react-native-onesignal').OneSignal
} catch (_) {}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

interface NotificationContextValue {
  scheduleDailyCheckin:    (hour?: number, minute?: number) => Promise<void>
  scheduleMilestoneAlert:  (daysFromNow: number, message: string) => Promise<void>
  cancelAll:               () => Promise<void>
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Register push token
    registerToken()

    // OneSignal init — only if available
    try {
      const appId = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? ''
      if (appId && OneSignal) {
        OneSignal.initialize(appId)
        OneSignal.Notifications.addEventListener('click', (event: any) => {
          const data = event?.notification?.additionalData as Record<string, any> | undefined
          if (data?.screen) router.push(data.screen as never)
        })
      }
    } catch (_) {}

    // Foreground tap handler
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, any> | undefined
      if (data?.screen) router.push(data.screen as never)
    })

    return () => sub.remove()
  }, [])

  const registerToken = async () => {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        })
      }
      const { status: existing } = await Notifications.getPermissionsAsync()
      if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        if (status !== 'granted') return
      }
      await Notifications.getExpoPushTokenAsync()
    } catch (_) {
      // Silently fail in Expo Go or when permissions denied
    }
  }

  const scheduleDailyCheckin = async (hour = 9, minute = 0) => {
    await Notifications.cancelAllScheduledNotificationsAsync()
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily check-in ☀️',
        body: "How are you feeling today? Your streak is counting on you.",
        data: { screen: '/(tabs)/dashboard' },
      },
      trigger: {
        hour,
        minute,
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
      },
    })
  }

  const scheduleMilestoneAlert = async (daysFromNow: number, message: string) => {
    const trigger = new Date()
    trigger.setDate(trigger.getDate() + daysFromNow)
    trigger.setHours(10, 0, 0, 0)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Milestone unlocked 🏆',
        body: message,
        data: { screen: '/(tabs)/progress' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: trigger,
      },
    })
  }

  const cancelAll = () => Notifications.cancelAllScheduledNotificationsAsync()

  return (
    <NotificationContext.Provider value={{ scheduleDailyCheckin, scheduleMilestoneAlert, cancelAll }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider')
  return ctx
}