import React from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Card from '../../src/components/common/Card'
import { useAuthStore } from '../../src/store/useAuthStore'
import { useDashboardStats } from '../../src/hooks/useDashboardStats'

const HEALTH_MILESTONES = [
  { hours: 0.33, label: '20 minutes', desc: 'Heart rate & blood pressure normalize' },
  { hours: 12,   label: '12 hours',   desc: 'Carbon monoxide levels return to normal' },
  { hours: 48,   label: '48 hours',   desc: 'Nerve endings begin to regrow' },
  { hours: 336,  label: '2 weeks',    desc: 'Circulation & lung function improve' },
  { hours: 2160, label: '3 months',   desc: 'Heart attack risk begins to drop' },
  { hours: 8760, label: '1 year',     desc: 'Heart disease risk halved' },
]

function timeOfDay() {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function formatTime(minutes: number) {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  return h < 24 ? `${h}h` : `${Math.floor(h / 24)}d`
}

export default function DashboardScreen() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { streak, cigarettesAvoided, moneySaved, lifeRegained, nextMilestone, loading, refresh } = useDashboardStats()
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.teal} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good {timeOfDay()}, {firstName} 👋</Text>
            <Text style={styles.date}>{formatDate()}</Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/settings')} style={styles.avatarBtn}>
            <Text style={styles.avatarText}>{(user?.name ?? 'U')[0].toUpperCase()}</Text>
          </Pressable>
        </View>

        {/* Streak hero */}
        <Card variant="teal" style={styles.streakCard}>
          <Text style={styles.streakLabel}>Current streak</Text>
          <Text style={styles.streakValue}>{streak ?? 0}</Text>
          <Text style={styles.streakUnit}>days smoke-free</Text>
        </Card>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Not smoked',     value: `${cigarettesAvoided ?? 0}`, sub: 'cigarettes' },
            { label: 'Money saved',    value: `₦${moneySaved?.toLocaleString() ?? '0'}`, sub: 'total' },
            { label: 'Life regained',  value: `${lifeRegained ?? 0}h`, sub: 'of your life' },
            { label: 'Health Score',   value: `${nextMilestone?.progressPercent ?? 0}%`, sub: nextMilestone?.name ?? 'loading' },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statSub}>{s.sub}</Text>
            </View>
          ))}
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.quickActions}>
          {[
            { icon: '🚨', label: 'Craving SOS', route: '/craving-rescue',      danger: true },
            { icon: '🚬', label: 'Log smoke',   route: '/logs/smoking',         danger: false },
            { icon: '📝', label: 'Log craving', route: '/logs/craving',         danger: false },
            { icon: '📊', label: 'Insights',    route: '/(tabs)/insights',      danger: false },
          ].map((a) => (
            <Pressable key={a.label} style={[styles.quickAction, a.danger && styles.quickActionDanger]} onPress={() => router.push(a.route as any)}>
              <Text style={{ fontSize: 22 }}>{a.icon}</Text>
              <Text style={[styles.quickLabel, a.danger && styles.quickLabelDanger]}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Health timeline */}
        <Text style={styles.sectionTitle}>Health recovery</Text>
        <Card style={{ padding: 0, overflow: 'hidden', marginBottom: spacing.xxl }}>
          {HEALTH_MILESTONES.map((m, i) => {
            const reached = (streak * 24) >= m.hours
            return (
              <View key={m.label} style={[styles.milestone, i < HEALTH_MILESTONES.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: colors.borderSoft }]}>
                <View style={[styles.milestoneDot, reached && styles.milestoneDotActive]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.milestoneLabel, reached && { color: colors.textPrimary }]}>{m.label}</Text>
                  <Text style={styles.milestoneDesc}>{m.desc}</Text>
                </View>
                {reached && <Text style={{ color: colors.teal, fontSize: 14 }}>✓</Text>}
              </View>
            )
          })}
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:               { flex: 1, backgroundColor: colors.bg },
  scroll:             { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: spacing.md },
  header:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  greeting:           { ...T.h3, color: colors.textPrimary },
  date:               { ...T.caption, color: colors.textMuted, marginTop: 2 },
  avatarBtn:          { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.tealBg, borderWidth: 1, borderColor: colors.tealDark, alignItems: 'center', justifyContent: 'center' },
  avatarText:         { ...T.bodyMedium, color: colors.tealLight },
  streakCard:         { alignItems: 'center', paddingVertical: spacing.xl, marginBottom: spacing.lg },
  streakLabel:        { ...T.captionMedium, color: colors.tealLight, letterSpacing: 0.5, marginBottom: spacing.xs },
  streakValue:        { fontSize: 64, fontWeight: '700', color: colors.tealLight, lineHeight: 72, letterSpacing: -2 },
  streakUnit:         { ...T.body, color: colors.teal, marginTop: 2 },
  streakRecord:       { ...T.caption, color: colors.textMuted, marginTop: spacing.sm },
  statsGrid:          { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  statCard:           { width: '47.5%', backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md },
  statValue:          { ...T.h2, color: colors.textPrimary, marginBottom: 2 },
  statLabel:          { ...T.captionMedium, color: colors.textMuted },
  statSub:            { ...T.caption, color: colors.textDim, marginTop: 1 },
  sectionTitle:       { ...T.captionMedium, color: colors.textMuted, letterSpacing: 0.5, marginBottom: spacing.sm },
  quickActions:       { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  quickAction:        { flex: 1, backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center', gap: spacing.xs },
  quickActionDanger:  { backgroundColor: colors.dangerBg, borderColor: colors.dangerBorder },
  quickLabel:         { ...T.caption, color: colors.textMuted, textAlign: 'center' },
  quickLabelDanger:   { color: colors.danger },
  milestone:          { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.lg, gap: spacing.md },
  milestoneDot:       { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border },
  milestoneDotActive: { backgroundColor: colors.teal },
  milestoneLabel:     { ...T.bodySmall, color: colors.textMuted, fontWeight: '500' },
  milestoneDesc:      { ...T.caption, color: colors.textDim, marginTop: 1 },
})