// @ts-ignore
import '../global.css'
import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NotificationProvider } from '../src/providers/NotificationProvider'
import { AuthProvider } from '../src/providers/AuthProvider'
import { useNotificationFeed } from '../src/hooks/useNotificationObserver'

export default function RootLayout() {
  useNotificationFeed()
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NotificationProvider>
            <StatusBar style="light" backgroundColor="#0d0f14" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0d0f14' } }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(onboarding)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="notifications" />
              <Stack.Screen name="profile/edit" />
              <Stack.Screen
                name="craving-rescue"
                options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
              />
              <Stack.Screen
                name="logs/smoking"
                options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
              />
            </Stack>
          </NotificationProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
