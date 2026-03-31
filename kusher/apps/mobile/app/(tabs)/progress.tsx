// import React from 'react'
// import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { useDashboardStats } from '../../src/hooks/useDashboardStats'
// import { colors, T, radius } from '../../src/constants/theme'
// import { StatCard } from '../../src/components/dashboard/StatCard'

// const { width } = Dimensions.get('window')

// export default function ProgressScreen() {
//   const { streak, cigarettesAvoided, moneySaved, lifeRegained, loading } = useDashboardStats()

//   return (
//     <SafeAreaView style={s.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
//         <View style={s.header}>
//           <Text style={s.title}>Your Progress</Text>
//           <Text style={s.sub}>Every second counts toward a healthier you.</Text>
//         </View>

//         <View style={s.mainStats}>
//           <View style={s.streakCircle}>
//             <Text style={s.streakValue}>{streak}</Text>
//             <Text style={s.streakLabel}>Day Streak</Text>
//           </View>
//         </View>

//         <View style={s.grid}>
//           <View style={s.row}>
//             <StatCard 
//               label="Cigarettes Avoided" 
//               value={cigarettesAvoided.toString()} 
//             />
//             <StatCard 
//               label="Money Saved" 
//               value={`₦${moneySaved.toLocaleString()}`} 
//             />
//           </View>
//           <View style={s.row}>
//             <StatCard 
//               label="Life Regained" 
//               value={`${lifeRegained}h`} 
//             />
//             <StatCard 
//               label="Health Score" 
//               value="85%" 
//             />
//           </View>
//         </View>

//         <View style={s.milestoneCard}>
//           <Text style={s.cardTitle}>Next Milestone</Text>
//           <View style={s.progressTrack}>
//             <View style={[s.progressBar, { width: '65%' }]} />
//           </View>
//           <Text style={s.milestoneText}>65% to 30-day streak</Text>
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// const s = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.bg },
//   scroll: { padding: 20, gap: 20 },
//   header: { gap: 4 },
//   title: { ...T.h1, color: colors.textPrimary },
//   sub: { ...T.body, color: colors.textMuted },
//   mainStats: { alignItems: 'center', marginVertical: 10 },
//   streakCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center' },
//   streakValue: { ...T.h2, color: '#fff' },
//   streakLabel: { ...T.caption, color: '#fff' },
//   grid: { gap: 12 },
//   row: { flexDirection: 'row', gap: 12 },
//   milestoneCard: { backgroundColor: colors.card, padding: 16, borderRadius: radius.sm, alignItems: 'center' },
//   cardTitle: { ...T.h2, color: colors.textPrimary, marginBottom: 12 },
//   progressTrack: { width: '100%', height: 10, backgroundColor: colors.border, borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
//   progressBar: { height: '100%', backgroundColor: colors.teal },
//   milestoneText: { ...T.caption, color: colors.textMuted }
// })

import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Card from '../../src/components/common/Card'
import { useProgress } from '../../src/hooks/useProgress'

type Period = '7d' | '30d' | '3m'
const PERIODS: { key: Period; label: string }[] = [
  { key: '7d', label: '7 days' }, { key: '30d', label: '30 days' }, { key: '3m', label: '3 months' },
]

function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1)
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 60 }}>
      {data.map((v, i) => (
        <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
          <View style={{ width: '100%', height: `${(v / max) * 100}%`, backgroundColor: color, borderRadius: 3, minHeight: 3 }} />
        </View>
      ))}
    </View>
  )
}

const PLACEHOLDER_MILESTONES = [
  { id: '1', title: '1 day smoke-free',   subtitle: '24 hours without a cigarette', achieved: true,  achievedAt: 'Day 1',  progress: undefined },
  { id: '2', title: '1 week smoke-free',  subtitle: 'Circulation starts improving', achieved: true,  achievedAt: 'Day 7',  progress: undefined },
  { id: '3', title: '2 weeks smoke-free', subtitle: 'Lung function improving',      achieved: false, achievedAt: null, progress: 64 },
  { id: '4', title: '1 month smoke-free', subtitle: 'Cilia in lungs recovering',    achieved: false, achievedAt: null, progress: 35 },
]

export default function ProgressScreen() {
  const [period, setPeriod] = useState<Period>('30d')
  const { stats: data, loading, refresh } = useProgress()

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.teal} />}>
        <Text style={styles.pageTitle}>Progress</Text>

        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <Pressable key={p.key} onPress={() => setPeriod(p.key)} style={[styles.periodBtn, period === p.key && styles.periodBtnActive]}>
              <Text style={[styles.periodText, period === p.key && styles.periodTextActive]}>{p.label}</Text>
            </Pressable>
          ))}
        </View>

        <Card style={{ marginBottom: spacing.md }}>
          <Text style={styles.cardLabel}>Smoke-free days</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
            <Text style={styles.rateValue}>{data?.smokeFreeRate ?? 0}%</Text>
            <View style={styles.rateBadge}>
              <Text style={styles.rateBadgeText}>{(data?.smokeFreeRate ?? 0) >= 80 ? '🔥 On fire' : '📈 Improving'}</Text>
            </View>
          </View>
          <MiniBarChart data={data?.dailySmokeFree ?? Array(14).fill(0).map(() => Math.random())} color={colors.teal} />
          <Text style={{ ...T.caption, color: colors.textDim, marginTop: spacing.xs }}>Each bar = 1 day</Text>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <Text style={styles.cardLabel}>Cravings resisted</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
            {[
              { val: `${data?.cravingsResisted ?? 0}`, lbl: 'resisted' },
              { val: `${data?.cravingsTotal ?? 0}`,    lbl: 'total' },
              { val: `${data?.cravingsTotal ? Math.round((data.cravingsResisted / data.cravingsTotal) * 100) : 0}%`, lbl: 'success' },
            ].map((s, i) => (
              <React.Fragment key={s.lbl}>
                {i > 0 && <View style={{ width: 0.5, height: 32, backgroundColor: colors.border, marginHorizontal: spacing.sm }} />}
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={[styles.rateValue, i === 2 && { color: colors.teal }]}>{s.val}</Text>
                  <Text style={{ ...T.caption, color: colors.textMuted }}>{s.lbl}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
          <MiniBarChart data={data?.dailyCravings ?? Array(14).fill(0).map(() => Math.round(Math.random() * 5))} color={colors.danger} />
        </Card>

        <Card style={{ marginBottom: spacing.lg }}>
          <Text style={styles.cardLabel}>Money saved</Text>
          <Text style={{ ...T.h1, color: colors.teal, fontSize: 36, marginBottom: 4 }}>${data?.moneySaved ?? '0.00'}</Text>
          <Text style={{ ...T.caption, color: colors.textMuted }}>At this rate: ${data?.projectedMonthly ?? '0'}/month</Text>
        </Card>

        <Text style={styles.sectionTitle}>Milestones</Text>
        {(data?.milestones ?? PLACEHOLDER_MILESTONES).map((m: { id: React.Key | null | undefined; achieved: any; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; subtitle: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; achievedAt: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; progress: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined }) => (
          <View key={m.id} style={styles.milestone}>
            <View style={[styles.milestoneCircle, m.achieved && styles.milestoneCircleActive]}>
              <Text style={{ fontSize: 12, color: '#fff' }}>{m.achieved ? '✓' : ''}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.milestoneTitle, m.achieved && { color: colors.textPrimary }]}>{m.title}</Text>
              <Text style={styles.milestoneSub}>{m.subtitle}</Text>
              {m.achievedAt ? <Text style={{ ...T.caption, color: colors.teal, marginTop: 2 }}>{m.achievedAt}</Text> : null}
            </View>
            {!m.achieved && m.progress !== undefined && (
              <View style={{ alignItems: 'flex-end', gap: 3, marginTop: 3 }}>
                <View style={{ width: 56, height: 4, borderRadius: 2, backgroundColor: colors.border, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${m.progress}%` as any, backgroundColor: colors.teal, borderRadius: 2 }} />
                </View>
                <Text style={{ ...T.caption, color: colors.textMuted }}>{m.progress}%</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:                 { flex: 1, backgroundColor: colors.bg },
  scroll:               { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: spacing.md },
  pageTitle:            { ...T.h1, color: colors.textPrimary, marginBottom: spacing.lg },
  periodRow:            { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.border, padding: 3, marginBottom: spacing.lg, gap: 3 },
  periodBtn:            { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: radius.sm },
  periodBtnActive:      { backgroundColor: colors.tealDark },
  periodText:           { ...T.captionMedium, color: colors.textMuted },
  periodTextActive:     { color: colors.tealLight },
  cardLabel:            { ...T.captionMedium, color: colors.textMuted, letterSpacing: 0.5, marginBottom: spacing.sm },
  rateValue:            { ...T.h1, color: colors.textPrimary, fontSize: 36 },
  rateBadge:            { backgroundColor: colors.tealBg, borderRadius: radius.sm, paddingVertical: 3, paddingHorizontal: spacing.sm, borderWidth: 0.5, borderColor: colors.tealDark },
  rateBadgeText:        { ...T.caption, color: colors.tealLight },
  sectionTitle:         { ...T.captionMedium, color: colors.textMuted, letterSpacing: 0.5, marginBottom: spacing.md, marginTop: spacing.sm },
  milestone:            { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.lg },
  milestoneCircle:      { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  milestoneCircleActive:{ backgroundColor: colors.teal, borderColor: colors.teal },
  milestoneTitle:       { ...T.bodySmall, color: colors.textMuted, fontWeight: '500' },
  milestoneSub:         { ...T.caption, color: colors.textDim, marginTop: 1 },
})