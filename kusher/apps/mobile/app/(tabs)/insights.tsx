// import React from 'react'
// import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { colors, T, radius } from '../../src/constants/theme'
// import { ChartIcon, StreakIcon, ClockIcon } from '../../src/components/common/Icons'

// const { width } = Dimensions.get('window')

// export default function InsightsScreen() {
//   return (
//     <SafeAreaView style={s.container}>
//       <ScrollView contentContainerStyle={s.scrollContent}>
//         <View style={s.header}>
//           <Text style={s.title}>Insights</Text>
//           <Text style={s.sub}>Understand your patterns and progress</Text>
//         </View>

//         <View style={s.grid}>
//           <View style={s.statCard}>
//             <View style={[s.iconCircle, { backgroundColor: 'rgba(45, 212, 191, 0.1)' }]}>
//               <StreakIcon color={colors.teal} size={20} />
//             </View>
//             <Text style={s.statValue}>12</Text>
//             <Text style={s.statLabel}>Day Streak</Text>
//           </View>

//           <View style={s.statCard}>
//             <View style={[s.iconCircle, { backgroundColor: 'rgba(248, 113, 113, 0.1)' }]}>
//               <ClockIcon color={colors.danger} size={20} />
//             </View>
//             <Text style={s.statValue}>4</Text>
//             <Text style={s.statLabel}>Cravings Beat</Text>
//           </View>
//         </View>

//         <View style={s.section}>
//           <Text style={s.sectionTitle}>Trigger Analysis</Text>
//           <View style={s.chartPlaceholder}>
//             <View style={s.barRow}>
//               <Text style={s.barLabel}>Stress</Text>
//               <View style={s.barContainer}>
//                 <View style={[s.bar, { width: '80%', backgroundColor: colors.teal }]}></View>
//               </View>
//             </View>
//             <View style={s.barRow}>
//               <Text style={s.barLabel}>Social</Text>
//               <View style={s.barContainer}>
//                 <View style={[s.bar, { width: '60%', backgroundColor: colors.teal }]}></View>
//               </View>
//             </View>
//             <View style={s.barRow}>
//               <Text style={s.barLabel}>Boredom</Text>
//               <View style={s.barContainer}>
//                 <View style={[s.bar, { width: '40%', backgroundColor: colors.teal }]}></View>
//               </View>
//             </View>
//           </View>
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// const s = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.bg },
//   scrollContent: { padding: 20, gap: 20 },
//   header: { marginBottom: 20 },
//   title: { fontSize: 24, fontFamily: 'Inter-Bold', color: colors.textPrimary },
//   sub: { fontSize: 14, fontFamily: 'Inter-Regular', color: colors.textDim },
//   grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
//   statCard: { flex: 1, alignItems: 'center', padding: 12, borderRadius: radius.sm, backgroundColor: colors.card },
//   iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
//   statValue: { fontSize: 20, fontFamily: 'Inter-Bold', color: colors.textPrimary },
//   statLabel: { fontSize: 12, fontFamily: 'Inter-Regular', color: colors.textDim },
//   section: { marginBottom: 20 },
//   sectionTitle: { fontSize: 16, fontFamily: 'Inter-Bold', color: colors.textPrimary, marginBottom: 12 },
//   chartPlaceholder: { backgroundColor: colors.card, borderRadius: radius.sm, padding: 12 },
//   barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
//   barLabel: { flex: 1, fontSize: 12, fontFamily: 'Inter-Regular', color: colors.textDim },
//   barContainer: { flex: 1, height: 8, borderRadius: radius.sm, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
//   bar: { height: '100%', borderRadius: radius.sm },
// })

import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Card from '../../src/components/common/Card'

type Tab = 'patterns' | 'triggers' | 'mood'

const TABS: { key: Tab; label: string }[] = [
  { key: 'patterns', label: 'Patterns' },
  { key: 'triggers', label: 'Triggers' },
  { key: 'mood',     label: 'Mood' },
]

const TRIGGER_DATA = [
  { label: 'Stress',        count: 14, pct: 88 },
  { label: 'After meals',   count: 9,  pct: 56 },
  { label: 'With coffee',   count: 8,  pct: 50 },
  { label: 'Boredom',       count: 6,  pct: 38 },
  { label: 'Social',        count: 4,  pct: 25 },
  { label: 'Driving',       count: 3,  pct: 19 },
]

const MOOD_DATA = [
  { day: 'M', score: 3 },
  { day: 'T', score: 4 },
  { day: 'W', score: 2 },
  { day: 'T', score: 4 },
  { day: 'F', score: 5 },
  { day: 'S', score: 4 },
  { day: 'S', score: 5 },
]

const HOUR_DATA = [
  { hour: '6am', cravings: 1 },
  { hour: '9am', cravings: 3 },
  { hour: '12pm',cravings: 4 },
  { hour: '3pm', cravings: 5 },
  { hour: '6pm', cravings: 3 },
  { hour: '9pm', cravings: 2 },
]

function HeatBar({ pct, color }: { pct: number; color: string }) {
  return (
    <View style={{ flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' }}>
      <View style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: 3 }} />
    </View>
  )
}

function PatternsTab() {
  const maxCravings = Math.max(...HOUR_DATA.map(h => h.cravings))
  return (
    <View>
      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardLabel}>Craving heatmap — by hour</Text>
        <Text style={styles.cardHint}>When your cravings are most intense this week</Text>
        <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
          {HOUR_DATA.map((h) => (
            <View key={h.hour} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <Text style={[styles.axisLabel, { width: 36 }]}>{h.hour}</Text>
              <HeatBar pct={(h.cravings / maxCravings) * 100} color={colors.danger} />
              <Text style={[styles.axisLabel, { width: 16, textAlign: 'right' }]}>{h.cravings}</Text>
            </View>
          ))}
        </View>
        <View style={styles.insightBox}>
          <Text style={styles.insightText}>⚡ Your danger zone is 3pm. Schedule a walk or breathing exercise for then.</Text>
        </View>
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardLabel}>Weekly craving trend</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 72, marginTop: spacing.md }}>
          {[5,8,6,9,4,3,2].map((v, i) => {
            const days = ['M','T','W','T','F','S','S']
            return (
              <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4, height: '100%' }}>
                <View style={{ width: '100%', height: `${(v / 9) * 100}%`, backgroundColor: colors.teal, borderRadius: 3 }} />
                <Text style={styles.axisLabel}>{days[i]}</Text>
              </View>
            )
          })}
        </View>
        <View style={styles.insightBox}>
          <Text style={styles.insightText}>📉 Your cravings are decreasing — down 60% from day 1.</Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardLabel}>Smoke-free streaks</Text>
        <View style={{ flexDirection: 'row', gap: 4, marginTop: spacing.md }}>
          {Array(30).fill(0).map((_, i) => {
            const smokeFree = Math.random() > 0.2
            return (
              <View
                key={i}
                style={{ flex: 1, height: 28, borderRadius: 3, backgroundColor: smokeFree ? colors.teal : colors.dangerBg }}
              />
            )
          })}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs }}>
          <Text style={styles.axisLabel}>Day 1</Text>
          <Text style={styles.axisLabel}>Day 30</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.lg, marginTop: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: colors.teal }} />
            <Text style={styles.axisLabel}>Smoke-free</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: colors.dangerBg }} />
            <Text style={styles.axisLabel}>Smoked</Text>
          </View>
        </View>
      </Card>
    </View>
  )
}

function TriggersTab() {
  return (
    <View>
      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardLabel}>Top triggers this month</Text>
        <Text style={styles.cardHint}>Based on your craving logs</Text>
        <View style={{ gap: spacing.md, marginTop: spacing.md }}>
          {TRIGGER_DATA.map((t, i) => (
            <View key={t.label} style={{ gap: 5 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.triggerLabel}>
                  {i === 0 ? '🔥 ' : ''}{t.label}
                </Text>
                <Text style={styles.triggerCount}>{t.count}×</Text>
              </View>
              <HeatBar pct={t.pct} color={i === 0 ? colors.danger : colors.teal} />
            </View>
          ))}
        </View>
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardLabel}>Trigger insight</Text>
        <View style={styles.insightBox}>
          <Text style={styles.insightText}>
            💡 Stress causes 88% of your cravings. Try the 4-7-8 breathing technique next time you feel overwhelmed — it activates your parasympathetic nervous system within 60 seconds.
          </Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardLabel}>Time of day vs trigger</Text>
        <Text style={styles.cardHint}>When each trigger tends to hit</Text>
        {[
          { trigger: 'Stress', times: ['9am','3pm','7pm'] },
          { trigger: 'Coffee', times: ['7am','10am'] },
          { trigger: 'After meals', times: ['12pm','7pm'] },
        ].map((t) => (
          <View key={t.trigger} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md }}>
            <Text style={[styles.triggerLabel, { width: 80 }]}>{t.trigger}</Text>
            <View style={{ flexDirection: 'row', gap: spacing.xs }}>
              {t.times.map(time => (
                <View key={time} style={styles.timeBadge}>
                  <Text style={styles.timeBadgeText}>{time}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </Card>
    </View>
  )
}

function MoodTab() {
  const maxScore = 5
  return (
    <View>
      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardLabel}>Mood this week</Text>
        <Text style={styles.cardHint}>Logged after craving events</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 80, marginTop: spacing.md }}>
          {MOOD_DATA.map((d, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4, height: '100%' }}>
              <View style={{
                width: '100%',
                height: `${(d.score / maxScore) * 100}%`,
                backgroundColor: d.score >= 4 ? colors.teal : d.score >= 3 ? colors.tealDark : colors.danger,
                borderRadius: 3,
              }} />
              <Text style={styles.axisLabel}>{d.day}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
          <Text style={styles.axisLabel}>1 = very low</Text>
          <Text style={styles.axisLabel}>5 = great</Text>
        </View>
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardLabel}>Mood vs smoking correlation</Text>
        <View style={{ gap: spacing.md, marginTop: spacing.md }}>
          {[
            { label: 'Low mood days with cravings', pct: 82, color: colors.danger },
            { label: 'High mood days smoke-free',   pct: 91, color: colors.teal },
            { label: 'Neutral days resisted',       pct: 68, color: colors.tealLight },
          ].map((c) => (
            <View key={c.label} style={{ gap: 5 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.triggerLabel}>{c.label}</Text>
                <Text style={[styles.triggerCount, { color: c.color }]}>{c.pct}%</Text>
              </View>
              <HeatBar pct={c.pct} color={c.color} />
            </View>
          ))}
        </View>
        <View style={styles.insightBox}>
          <Text style={styles.insightText}>
            🌟 Your mood is your most reliable smoke-free predictor. Use the mood check-in daily to stay ahead.
          </Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardLabel}>Weekly mood average</Text>
        <Text style={{ ...T.h1, color: colors.teal, fontSize: 42 }}>3.8<Text style={{ ...T.body, color: colors.textMuted }}> / 5</Text></Text>
        <Text style={{ ...T.bodySmall, color: colors.textMuted, marginTop: spacing.xs }}>Up from 2.9 last week — your mood is improving as your body recovers.</Text>
      </Card>
    </View>
  )
}

export default function InsightsScreen() {
  const [tab, setTab]           = useState<Tab>('patterns')
  const [loading, setLoading]   = useState(false)

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => {}} tintColor={colors.teal} />}
      >
        <Text style={styles.pageTitle}>Insights</Text>

        <View style={styles.tabRow}>
          {TABS.map((t) => (
            <Pressable key={t.key} onPress={() => setTab(t.key)} style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}>
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        {tab === 'patterns' && <PatternsTab />}
        {tab === 'triggers' && <TriggersTab />}
        {tab === 'mood'     && <MoodTab />}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.bg },
  scroll:        { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: spacing.md },
  pageTitle:     { ...T.h1, color: colors.textPrimary, marginBottom: spacing.lg },
  tabRow:        { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.border, padding: 3, marginBottom: spacing.lg, gap: 3 },
  tabBtn:        { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: radius.sm },
  tabBtnActive:  { backgroundColor: colors.tealDark },
  tabText:       { ...T.captionMedium, color: colors.textMuted },
  tabTextActive: { color: colors.tealLight },
  cardLabel:     { ...T.captionMedium, color: colors.textMuted, letterSpacing: 0.5 },
  cardHint:      { ...T.caption, color: colors.textDim, marginTop: 2 },
  axisLabel:     { ...T.caption, color: colors.textDim },
  insightBox:    { backgroundColor: colors.tealBg, borderWidth: 0.5, borderColor: colors.tealDark, borderRadius: radius.sm, padding: spacing.md, marginTop: spacing.md },
  insightText:   { ...T.bodySmall, color: colors.tealLight, lineHeight: 20 },
  triggerLabel:  { ...T.bodySmall, color: colors.textSecondary },
  triggerCount:  { ...T.captionMedium, color: colors.textMuted },
  timeBadge:     { backgroundColor: colors.surface, borderRadius: radius.sm, paddingVertical: 2, paddingHorizontal: 7, borderWidth: 0.5, borderColor: colors.border },
  timeBadgeText: { ...T.caption, color: colors.textMuted },
})