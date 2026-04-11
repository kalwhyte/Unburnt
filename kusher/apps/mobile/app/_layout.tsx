// @ts-ignore
import '../global.css'
import { useEffect, useRef } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { useAuthStore } from '../src/store/useAuthStore'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NotificationProvider } from '../src/providers/NotificationProvider'
import { AuthProvider } from '../src/providers/AuthProvider'
import { useNotificationFeed } from '../src/hooks/useNotificationObserver'
import { View, ActivityIndicator } from 'react-native'


export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const navigationRef = useRef(false);
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);


  useEffect(() => {
    if (!hasHydrated) return;
    if (navigationRef.current) return;

    const inOnboarding = segments[0] === '(onboarding)';
    const inAuth = segments[0] === '(auth)';

    if (!isAuthenticated && !inOnboarding && !inAuth) {
      navigationRef.current = true;
      router.replace('/(auth)/login');
    }

    if (isAuthenticated && (inOnboarding || inAuth)) {
      navigationRef.current = true;
      router.replace('/(tabs)/dashboard');
    }
  }, [hasHydrated, isAuthenticated, segments[0]]);

  useEffect(() => {
    navigationRef.current = false;
  }, [isAuthenticated]);

  useNotificationFeed()

    // Block render until AsyncStorage has loaded auth state
  if (!hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0d0f14' }}>
        <ActivityIndicator color="#ffffff" />
      </View>
    );
  }

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
