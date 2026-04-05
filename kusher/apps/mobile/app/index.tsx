import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
import { useOnboardingStore } from '../src/store/onboardingStore';

export default function Index() {
  const { token } = useAuthStore();
  const { completed } = useOnboardingStore();

  if (!token) return <Redirect href="/(auth)/welcome" />;
  if (!completed) return <Redirect href="/(onboarding)/welcome" />;
  return <Redirect href="/(tabs)/dashboard" />;
}