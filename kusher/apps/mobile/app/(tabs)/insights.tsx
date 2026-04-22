import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Card from '../../src/components/common/Card'
import { Badge } from '../../src/components/common/Badge'
import { useInsights } from '../../src/hooks/useInsights'

type Tab = 'patterns' | 'triggers' | 'mood'
const TABS: { key: Tab; label: string }[] = [
  { key: 'patterns', label: 'Patterns' },
  { key: 'triggers', label: 'Triggers' },
  { key: 'mood',     label: 'Mood' },
]

function HeatBar({ pct, color }: { pct: number; color: string }) {
  return (
    <View style={s.barTrack}>
      <View style={[s.barFill, { width: `${Math.min(pct, 100)}%` as any, backgroundColor: color }]} />
    </View>
  )
}

function StatRow({ items }: { items: { val: string | number; label: string; danger?: boolean }[] }) {
  return (
    <View style={s.statRow}>
      {items.map((item) => (
        <View key={item.label} style={s.statBox}>
          <Text style={[s.statVal, item.danger && { color: colors.danger }]}>{item.val}</Text>
          <Text style={s.statLbl}>{item.label}</Text>
        </View>
      ))}
    </View>
  )
}

function EmptyCard({ message }: { message: string }) {
  return (
    <Card style={s.emptyCard}>
      <Text style={s.emptyText}>{message}</Text>
    </Card>
  )
}

function MoodChip({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <View style={s.moodChip}>
      <View style={[s.moodDot, { backgroundColor: color }]} />
      <Text style={s.moodLabel}>{label}</Text>
      <Text style={s.moodCount}>{count}×</Text>
    </View>
  )
}

function PatternsTab({ data }: { data: any }) {
  const peakHours  = data?.peakHours
  const reduction  = data?.reduction
  const willpower  = data?.cravingVsSmoking
  const byHour     = peakHours?.byHour ?? []
  const trend      = reduction?.trend ?? []
  const maxTotal   = Math.max(...byHour.map((h: any) => h.total), 1)
  const maxWeek    = Math.max(...trend.map((w: any) => w.total), 1)

  return (
    <View>
      {willpower && (
        <StatRow items={[
          { val: `${willpower.willpowerRate ?? 0}%`, label: 'Willpower' },
          { val: willpower.resisted ?? 0,            label: 'Resisted' },
          { val: willpower.smokedOnCraving ?? 0,     label: 'Smoked', danger: true },
        ]} />
      )}

      <Card style={s.card}>
        <Text style={s.cardLabel}>CRAVING BY HOUR</Text>
        <Text style={s.cardHint}>When your urges hit hardest</Text>
        {byHour.length === 0
          ? <Text style={s.emptyText}>No data yet — log some cravings first.</Text>
          : byHour.slice(0, 6).map((h: any) => (
            <View key={h.hour} style={s.barRow}>
              <Text style={s.axisLabel}>{h.label}</Text>
              <HeatBar pct={(h.total / maxTotal) * 100} color={colors.danger} />
              <Text style={s.barCount}>{h.total}</Text>
            </View>
          ))
        }
        {peakHours?.hardestTimeOfDay && (
          <View style={s.insightBox}>
            <Text style={s.insightText}>
              Your danger zone is {peakHours.hardestTimeOfDay.label}. Schedule a walk or breathing exercise then.
            </Text>
          </View>
        )}
      </Card>

      <Card style={s.card}>
        <Text style={s.cardLabel}>WEEKLY TREND</Text>
        <Text style={s.cardHint}>Last 6 weeks vs your baseline</Text>
        {trend.length === 0
          ? <Text style={s.emptyText}>No data yet.</Text>
          : (
            <View style={s.chartRow}>
              {trend.map((w: any, i: number) => (
                <View key={i} style={s.chartCol}>
                  <View style={[s.chartBar, {
                    height: `${Math.max((w.total / maxWeek) * 100, 4)}%` as any,
                    backgroundColor: i === trend.length - 1 ? colors.teal : colors.tealDark,
                  }]} />
                  <Text style={s.axisLabel}>W{i + 1}</Text>
                </View>
              ))}
            </View>
          )
        }
        {reduction?.overallReductionPercent != null && (
          <View style={s.insightBox}>
            <Text style={s.insightText}>
              {reduction.overallReductionPercent >= 0
                ? `Down ${reduction.overallReductionPercent}% from week 1 — great progress.`
                : `Up ${Math.abs(reduction.overallReductionPercent)}% from week 1 — keep pushing.`}
            </Text>
          </View>
        )}
      </Card>
    </View>
  )
}

function TriggersTab({ data }: { data: any }) {
  const triggers = data?.triggers?.triggers ?? []
  const top      = data?.triggers?.topTrigger
  const hardest  = data?.triggers?.hardest
  const maxTotal = Math.max(...triggers.map((t: any) => t.total), 1)

  if (triggers.length === 0) return <EmptyCard message="No trigger data yet. Log some cravings with triggers to see patterns." />

  const getRisk = (successRate: number | null) => {
    if (successRate === null) return { label: 'Unknown', variant: 'primary' as const }
    if (successRate < 40)    return { label: 'Highest risk', variant: 'danger' as const }
    if (successRate < 65)    return { label: 'Watch out', variant: 'warning' as const }
    return { label: 'Manageable', variant: 'success' as const }
  }

  return (
    <View>
      <Card style={s.card}>
        <Text style={s.cardLabel}>TOP TRIGGERS</Text>
        <Text style={s.cardHint}>Across all logs this week</Text>
        {triggers.slice(0, 6).map((t: any) => {
          const risk = getRisk(t.successRate)
          return (
            <View key={t.id} style={s.triggerItem}>
              <View style={s.triggerTop}>
                <Text style={s.triggerName}>{t.name}</Text>
                <Badge label={risk.label} variant={risk.variant} size="sm" />
              </View>
              <HeatBar pct={(t.total / maxTotal) * 100} color={risk.variant === 'danger' ? colors.danger : colors.teal} />
              <Text style={s.triggerMeta}>{t.total} times{t.successRate != null ? ` · ${t.successRate}% success rate` : ''}</Text>
            </View>
          )
        })}
      </Card>

      {top && (
        <Card style={s.card}>
          <Text style={s.cardLabel}>TRIGGER INSIGHT</Text>
          <View style={[s.insightBox, { marginTop: 0 }]}>
            <Text style={s.insightText}>
              {top.name} is your most common trigger ({top.total} times).
              {hardest?.successRate != null ? ` Hardest to resist: ${hardest.name} (${hardest.successRate}% success rate).` : ''}
            </Text>
          </View>
        </Card>
      )}
    </View>
  )
}

function MoodTab({ data }: { data: any }) {
  const mood = data?.mood
  if (!mood || mood.whenCraving.length === 0) {
    return <EmptyCard message="No mood data yet. Log some cravings with mood to see patterns." />
  }

  return (
    <View>
      <Card style={s.card}>
        <Text style={s.cardLabel}>MOOD WHEN CRAVING</Text>
        <Text style={s.cardHint}>How you feel when urges hit</Text>
        <View style={s.chipWrap}>
          {mood.whenCraving.slice(0, 5).map((m: any) => (
            <MoodChip key={m.mood} label={m.mood} count={m.count} color={colors.danger} />
          ))}
        </View>
      </Card>

      {mood.whenResisted.length > 0 && (
        <Card style={s.card}>
          <Text style={s.cardLabel}>MOOD WHEN RESISTING</Text>
          <Text style={s.cardHint}>Your strongest mental states</Text>
          <View style={s.chipWrap}>
            {mood.whenResisted.slice(0, 5).map((m: any) => (
              <MoodChip key={m.mood} label={m.mood} count={m.count} color={colors.teal} />
            ))}
          </View>
          {mood.topResistedMood && (
            <View style={s.insightBox}>
              <Text style={s.insightText}>
                You resist best when feeling {mood.topResistedMood}. Use that state to your advantage.
              </Text>
            </View>
          )}
        </Card>
      )}

      {mood.topSmokingMood && (
        <Card style={[s.card, s.dangerCard] as any}>
          <Text style={[s.cardLabel, { color: colors.danger }]}>WATCH OUT FOR</Text>
          <Text style={[s.cardHint, { marginBottom: 0, marginTop: spacing.xs }]}>
            You're most likely to smoke when feeling{' '}
            <Text style={{ color: colors.danger, fontWeight: '500' }}>{mood.topSmokingMood}</Text>.
            Have your rescue plan ready.
          </Text>
        </Card>
      )}
    </View>
  )
}

export default function InsightsScreen() {
  const [tab, setTab] = useState<Tab>('patterns')
  const { data, loading, error, refresh } = useInsights()

  useFocusEffect(React.useCallback(() => { refresh() }, [refresh]))

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.teal} />}
      >
        <Text style={s.pageTitle}>Insights</Text>

        <View style={s.tabRow}>
          {TABS.map((t) => (
            <Pressable key={t.key} onPress={() => setTab(t.key)} style={[s.tabBtn, tab === t.key && s.tabBtnActive]}>
              <Text style={[s.tabText, tab === t.key && s.tabTextActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        {loading && !data ? (
          <View style={s.loader}><ActivityIndicator color={colors.teal} /></View>
        ) : error ? (
          <EmptyCard message="Failed to load insights. Pull down to retry." />
        ) : (
          <>
            {tab === 'patterns' && <PatternsTab data={data} />}
            {tab === 'triggers' && <TriggersTab data={data} />}
            {tab === 'mood'     && <MoodTab     data={data} />}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.bg },
  scroll:      { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: spacing.md },
  pageTitle:   { ...T.h1, color: colors.textPrimary, marginBottom: spacing.lg },
  loader:      { alignItems: 'center', paddingTop: 60 },

  tabRow:        { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.border, padding: 3, marginBottom: spacing.lg, gap: 3 },
  tabBtn:        { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: radius.sm },
  tabBtnActive:  { backgroundColor: colors.tealDark },
  tabText:       { ...T.captionMedium, color: colors.textMuted },
  tabTextActive: { color: colors.tealLight },

  statRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  statBox: { flex: 1, backgroundColor: colors.tealBg, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.tealDark, padding: spacing.md, alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '600', color: colors.tealLight },
  statLbl: { ...T.caption, color: colors.textMuted, marginTop: 3 },

  card:      { marginBottom: spacing.md },
  dangerCard:{ borderColor: colors.dangerBorder, backgroundColor: colors.dangerBg },
  cardLabel: { ...T.captionMedium, color: colors.textMuted, letterSpacing: 0.8, marginBottom: 2 },
  cardHint:  { ...T.caption, color: colors.textDim, marginBottom: spacing.md },
  emptyCard: { marginBottom: spacing.md, alignItems: 'center', paddingVertical: spacing.xl },
  emptyText: { ...T.bodySmall, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs },

  barRow:   { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  barTrack: { flex: 1, height: 5, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  barFill:  { height: '100%', borderRadius: 3 },
  barCount: { ...T.caption, color: colors.textDim, width: 18, textAlign: 'right' },
  axisLabel:{ ...T.caption, color: colors.textDim, width: 38 },

  chartRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 5, height: 72, marginBottom: spacing.sm },
  chartCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4, height: '100%' },
  chartBar: { width: '100%', borderRadius: 3 },

  insightBox:  { backgroundColor: colors.tealBg, borderWidth: 0.5, borderColor: colors.tealDark, borderRadius: radius.sm, padding: spacing.md, marginTop: spacing.md },
  insightText: { ...T.bodySmall, color: colors.tealLight, lineHeight: 20 },

  triggerItem: { marginBottom: spacing.md },
  triggerTop:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  triggerName: { ...T.bodySmall, color: colors.textSecondary },
  triggerMeta: { ...T.caption, color: colors.textDim, marginTop: 5 },

  chipWrap:   { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
  moodChip:   { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surfaceAlt, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.full, paddingVertical: 6, paddingHorizontal: spacing.md },
  moodDot:    { width: 6, height: 6, borderRadius: 3 },
  moodLabel:  { ...T.bodySmall, color: colors.textSecondary },
  moodCount:  { ...T.caption, color: colors.textMuted },
})