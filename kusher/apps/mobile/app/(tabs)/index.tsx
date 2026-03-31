// app/(tabs)/index.tsx  —  Dashboard / Home
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDashboardStats } from '../../src/hooks/useDashboardStats'
import { StreakHero } from '@/components/dashboard/StreakHero'
import { StatCard } from '@/components/dashboard/StatCard'
import { CravingSOS } from '@/components/rescue/CravingSOS'
import { colors, T } from '@/constants/theme'

export default function DashboardScreen() {
  const router = useRouter()
  const { streak, cigarettesAvoided, moneySaved, lifeRegained, loading } = useDashboardStats()

  return (
    <SafeAreaView style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Good morning,</Text>
            <Text style={s.name}>Emmanuel 👋</Text>
          </View>
          <TouchableOpacity style={s.notifBtn} onPress={() => router.push('/notifications')}>
            {/* NotificationBell with badge */}
          </TouchableOpacity>
        </View>

        {/* Streak hero card */}
        <StreakHero days={streak} />

        {/* Stat cards row */}
        <View style={s.statsRow}>
          <StatCard label="not smoked" value={cigarettesAvoided.toString()} unit="cigs" />
          <StatCard label="saved" value={`₦${(moneySaved / 1000).toFixed(1)}k`} />
          <StatCard label="life regained" value={`${lifeRegained}h`} />
        </View>

        {/* Craving SOS banner */}
        <CravingSOS onPress={() => router.push('/craving-rescue')} />

        {/* Log a smoke CTA */}
        <TouchableOpacity style={s.logBtn} onPress={() => router.push('/log-smoke')}>
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
})
