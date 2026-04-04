import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDashboardStats } from '../../src/hooks/useDashboardStats'
import { useNotificationFeed } from '../../src/hooks/useNotificationObserver'
import { StreakHero } from '@/components/dashboard/StreakHero'
import { StatCard } from '@/components/dashboard/StatCard'
import { CravingSOS } from '@/components/rescue/CravingSOS'
import { colors, T } from '@/constants/theme'

export default function DashboardHomeScreen() {
  const router = useRouter()
  const { unreadCount } = useNotificationFeed()
  const { streak, cigarettesAvoided, moneySaved, lifeRegained, loading } = useDashboardStats()

  return (
    <SafeAreaView style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Good morning,</Text>
            <Text style={s.name}>Welcome back 👋</Text>
          </View>
          <TouchableOpacity style={s.notifBtn} onPress={() => router.push('/notifications')}>
            <Text style={{ fontSize: 18 }}>🔔</Text>
            {unreadCount > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <StreakHero days={streak} />
        <View style={s.statsRow}>
          <StatCard label="not smoked" value={cigarettesAvoided.toString()} unit="cigs" />
          <StatCard label="saved" value={`₦${moneySaved?.toLocaleString() ?? '0'}`} unit="total" />
          <StatCard label="life regained" value={`${lifeRegained}h`} />
        </View>
        <CravingSOS onPress={() => router.push('/craving-rescue')} />
        <TouchableOpacity style={s.logBtn} onPress={() => router.push('/logs/smoking')}>
          <Text style={s.logBtnText}>+ Log a cigarette</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  greeting: { ...T.caption, color: colors.textMuted },
  name: { ...T.h2, color: colors.textPrimary },
  notifBtn: { width: 36, height: 36, backgroundColor: colors.tealDark, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', gap: 8 },
  logBtn: { borderWidth: 0.5, borderColor: colors.border, borderRadius: 12, height: 44, alignItems: 'center', justifyContent: 'center' },
  logBtnText: { ...T.body, color: colors.textMuted },
  badge:     { position: 'absolute', top: -4, right: -4, backgroundColor: colors.danger, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
})
