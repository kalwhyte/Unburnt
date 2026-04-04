
import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';

export default function Index() {
  const { token } = useAuthStore();
  return <Redirect href={token ? '/(tabs)/dashboard' : '/(auth)/welcome'} />;
}