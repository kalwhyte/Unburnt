import { Stack } from 'expo-router'

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0d0f14' }, animation: 'slide_from_right' }}>
      <Stack.Screen name="smoking-profile" />
      <Stack.Screen name="smoking-habits" />
      <Stack.Screen name="triggers" />
      <Stack.Screen name="reasons" />
      <Stack.Screen name="quit-plan" />
      <Stack.Screen name="notifications-opt-in" />
      <Stack.Screen name="complete" />
    </Stack>
  )
}
