import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native'
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

        <View style={s.promoSection}>
          <Text style={s.sectionTitle}>Exclusive Offers</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.promoScroll}>
            <TouchableOpacity style={[s.promoCard, { backgroundColor: '#2D3436' }]}>
              <Text style={s.promoTag}>PROMO</Text>
              <Text style={s.promoTitle}>Get 20% off Nicotine Patches</Text>
              <Text style={s.promoSub}>Use code: UNBURNT20</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.promoCard, { backgroundColor: colors.tealDark }]}>
              <Text style={s.promoTag}>NEW</Text>
              <Text style={s.promoTitle}>Join the 30-Day Challenge</Text>
              <Text style={s.promoSub}>Win exclusive rewards</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={s.statsRow}>
          <StatCard label="not smoked" value={cigarettesAvoided.toString()} unit="cigs" />
          <StatCard label="saved" value={`₦${moneySaved?.toLocaleString() ?? '0'}`} unit="total" />
          <StatCard label="life regained" value={`${lifeRegained}h`} />
        </View>

        <View style={s.milestoneCard}>
          <Text style={s.milestoneTitle}>Next Health Milestone</Text>
          <Text style={s.milestoneDesc}>Your sense of taste and smell will significantly improve in 2 days.</Text>
          <View style={s.progressBg}><View style={[s.progressFill, { width: '60%' }]} /></View>
        </View>

        <CravingSOS onPress={() => router.push('/craving-rescue')} />

        <TouchableOpacity style={s.adBanner}>
          <View style={s.adInfo}>
            <Text style={s.adLabel}>SPONSORED</Text>
            <Text style={s.adTitle}>BetterHelp: Online Therapy</Text>
            <Text style={s.adDesc}>Speak with a licensed therapist today.</Text>
          </View>
          <View style={s.adAction}><Text style={s.adActionText}>Learn More</Text></View>
        </TouchableOpacity>

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
  sectionTitle: { ...T.h4, color: colors.textPrimary, marginBottom: 8 },
  promoSection: { marginVertical: 8 },
  promoScroll: { gap: 12 },
  promoCard: { width: 260, padding: 16, borderRadius: 16, height: 110, justifyContent: 'center' },
  promoTag: { fontSize: 10, fontWeight: '800', color: colors.teal, marginBottom: 4 },
  promoTitle: { ...T.bodyBold, color: '#fff' },
  promoSub: { ...T.caption, color: 'rgba(255,255,255,0.7)' },
  statsRow: { flexDirection: 'row', gap: 8 },
  milestoneCard: { backgroundColor: colors.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  milestoneTitle: { ...T.bodyBold, color: colors.textPrimary },
  milestoneDesc: { ...T.caption, color: colors.textMuted, marginVertical: 8 },
  progressBg: { height: 6, backgroundColor: colors.border, borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: colors.teal, borderRadius: 3 },
  adBanner: { flexDirection: 'row', backgroundColor: '#F8F9FA', borderRadius: 12, padding: 12, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: colors.border },
  adInfo: { flex: 1 },
  adLabel: { fontSize: 8, fontWeight: '800', color: colors.textMuted, marginBottom: 2 },
  adTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  adDesc: { fontSize: 11, color: colors.textMuted },
  adAction: { backgroundColor: colors.textPrimary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  adActionText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  notifBtn: { width: 36, height: 36, backgroundColor: colors.tealDark, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logBtn: { borderWidth: 0.5, borderColor: colors.border, borderRadius: 12, height: 44, alignItems: 'center', justifyContent: 'center' },
  logBtnText: { ...T.body, color: colors.textMuted },
  badge:     { position: 'absolute', top: -4, right: -4, backgroundColor: colors.danger, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
})
