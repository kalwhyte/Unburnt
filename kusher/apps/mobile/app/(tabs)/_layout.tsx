import { colors, T } from '../../src/constants/theme'
import { HomeIcon, ChartIcon, InsightsIcon, SettingsIcon} from '../../src/components/common/Icons'
import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a0c10',
          borderTopWidth: 0.5,
          borderTopColor: '#1e2130',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.textDim,
        tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter-Regular' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }: { color: string }) => <HomeIcon color={color} /> }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: ({ color }: { color: string }) => <ChartIcon color={color} /> }} />
      <Tabs.Screen name="insights" options={{ title: 'Insights', tabBarIcon: ({ color }: { color: string }) => <InsightsIcon color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Profile', tabBarIcon: ({ color }: { color: string }) => <SettingsIcon color={color} /> }} />
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard', tabBarIcon: ({ color }: { color: string }) => <ChartIcon color={color} /> }} />
      <Tabs.Screen name="support" options={{ href: null }} />
      </Tabs>
  )
}