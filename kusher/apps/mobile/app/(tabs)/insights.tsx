import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Card from '../../src/components/common/Card'
import { useInsights } from '../../src/hooks/useInsights'

type Tab = 'patterns' | 'triggers' | 'mood'
const TABS: { key: Tab; label: string }[] = [
  { key: 'patterns', label: 'Patterns' },
  { key: 'triggers', label: 'Triggers' },
  { key: 'mood',     label: 'Mood' },
]

function HeatBar({ pct, color }: { pct: number; color: string }) {
  return (
    <View style={{ flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' }}>
      <View style={{ width: `${Math.min(pct, 100)}%`, height: '100%', backgroundColor: color, borderRadius: 3 }} />
    </View>
  )
}

function EmptyCard({ message }: { message: string }) {
  return (
    <Card style={{ marginBottom: spacing.md, alignItems: 'center', paddingVertical: spacing.xl }}>
      <Text style={{ fontSize: 32, marginBottom: spacing.sm }}>📭</Text>
      <Text style={{ ...T.body, color: colors.textMuted, textAlign: 'center' }}>{message}</Text>
    </Card>
  )
}

function PatternsTab({ data }: { data: any }) {
  const peakHours = data?.peakHours
  const reduction = data?.reduction
  const willpower = data?.cravingVsSmoking

  const byHour = peakHours?.byHour ?? []
  const maxTotal = Math.max(...byHour.map((h: any) => h.total), 1)
  const trend = reduction?.trend ?? []
  const maxWeek = Math.max(...trend.map((w: any) => w.total), 1)

  return (
    <View>
      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardLabel}>Craving & smoking by hour</Text>
        <Text style={styles.cardHint}>When your urges hit hardest</Text>
        {byHour.length === 0 ? (
          <Text style={{ ...T.caption, color: colors.textDim, marginTop: spacing.md }}>No data yet — log some cravings first.</Text>
        ) : (
          <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
            {byHour.slice(0, 8).map((h: any) => (
              <View key={h.hour} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Text style={[styles.axisLabel, { width: 40 }]}>{h.label}</Text>
                <HeatBar pct={(h.total / maxTotal) * 100} color={colors.danger} />
                <Text style={[styles.axisLabel, { width: 20, textAlign: 'right' }]}>{h.total}</Text>
              </View>
            ))}
          </View>
        )}
        {peakHours?.hardestTimeOfDay && (
          <View style={styles.insightBox}>
            <Text style={styles.insightText}>
              ⚡ Your danger zone is {peakHours.hardestTimeOfDay.label}. Schedule a walk or breathing exercise then.
            </Text>
          </View>
        )}
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardLabel}>Weekly cigarette trend</Text>
        <Text style={styles.cardHint}>Last 6 weeks vs your baseline</Text>
        {trend.length === 0 ? (
          <Text style={{ ...T.caption, color: colors.textDim, marginTop: spacing.md }}>No data yet.</Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 72, marginTop: spacing.md }}>
            {trend.map((w: any, i: number) => (
              <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4, height: '100%' }}>
                <View style={{ width: '100%', height: `${Math.max((w.total / maxWeek) * 100, 4)}%`, backgroundColor: colors.teal, borderRadius: 3 }} />
                <Text style={styles.axisLabel}>W{i + 1}</Text>
              </View>
            ))}
          </View>
        )}
        {reduction?.overallReductionPercent !== null && reduction?.overallReductionPercent !== undefined && (
          <View style={styles.insightBox}>
            <Text style={styles.insightText}>
              {reduction.overallReductionPercent >= 0
                ? `📉 Down ${reduction.overallReductionPercent}% from week 1 — great progress.`
                : `📈 Up ${Math.abs(reduction.overallReductionPercent)}% from week 1 — keep pushing.`}
            </Text>
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.cardLabel}>Willpower ratio</Text>
        {willpower ? (
          <>
            <Text style={{ ...T.h1, color: colors.teal, fontSize: 42 }}>
              {willpower.willpowerRate ?? 0}
              <Text style={{ ...T.body, color: colors.textMuted }}>%</Text>
            </Text>
            <Text style={{ ...T.bodySmall, color: colors.textMuted, marginTop: spacing.xs }}>
              {willpower.verdict ?? 'Keep going.'}
            </Text>
            <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
              {[
                { label: 'Cravings resisted', val: willpower.resisted,        color: colors.teal   },
                { label: 'Smoked on craving', val: willpower.smokedOnCraving, color: colors.danger },
                { label: 'Unresolved',         val: willpower.unresolved,      color: colors.border },
              ].map((s) => (
                <View key={s.label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.axisLabel}>{s.label}</Text>
                  <Text style={{ ...T.captionMedium, color: s.color }}>{s.val}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <Text style={{ ...T.caption, color: colors.textDim, marginTop: spacing.md }}>No data yet.</Text>
        )}
      </Card>
    </View>
  )
}

function TriggersTab({ data }: { data: any }) {
  const triggers = data?.triggers?.triggers ?? []
  const top = data?.triggers?.topTrigger
  const hardest = data?.triggers?.hardest
  const maxTotal = Math.max(...triggers.map((t: any) => t.total), 1)

  if (triggers.length === 0) return <EmptyCard message="No trigger data yet. Log some cravings with triggers to see patterns." />

  return (
    <View>
      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardLabel}>Top triggers</Text>
        <Text style={styles.cardHint}>Across smoking and craving logs</Text>
        <View style={{ gap: spacing.md, marginTop: spacing.md }}>
          {triggers.slice(0, 6).map((t: any, i: number) => (
            <View key={t.id} style={{ gap: 5 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.triggerLabel}>{i === 0 ? '🔥 ' : ''}{t.name}</Text>
                <Text style={styles.triggerCount}>{t.total}×</Text>
              </View>
              <HeatBar pct={(t.total / maxTotal) * 100} color={i === 0 ? colors.danger : colors.teal} />
            </View>
          ))}
        </View>
      </Card>

      {top && (
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={styles.cardLabel}>Trigger insight</Text>
          <View style={styles.insightBox}>
            <Text style={styles.insightText}>
              💡 {top.name} is your most common trigger ({top.total} times).
              {hardest && hardest.successRate !== null
                ? ` Hardest to resist: ${hardest.name} (${hardest.successRate}% success rate).`
                : ''}
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

  const maxCraving = Math.max(...mood.whenCraving.map((m: any) => m.count), 1)

  return (
    <View>
      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardLabel}>Mood when craving</Text>
        <Text style={styles.cardHint}>How you feel when urges hit</Text>
        <View style={{ gap: spacing.md, marginTop: spacing.md }}>
          {mood.whenCraving.slice(0, 5).map((m: any) => (
            <View key={m.mood} style={{ gap: 5 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.triggerLabel}>{m.mood}</Text>
                <Text style={styles.triggerCount}>{m.count}×</Text>
              </View>
              <HeatBar pct={(m.count / maxCraving) * 100} color={colors.danger} />
            </View>
          ))}
        </View>
      </Card>

      {mood.whenResisted.length > 0 && (
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={styles.cardLabel}>Mood when resisting</Text>
          <Text style={styles.cardHint}>Your strongest mental states</Text>
          <View style={{ gap: spacing.md, marginTop: spacing.md }}>
            {mood.whenResisted.slice(0, 5).map((m: any) => (
              <View key={m.mood} style={{ gap: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.triggerLabel}>{m.mood}</Text>
                  <Text style={styles.triggerCount}>{m.count}×</Text>
                </View>
                <HeatBar pct={(m.count / Math.max(...mood.whenResisted.map((r: any) => r.count), 1)) * 100} color={colors.teal} />
              </View>
            ))}
          </View>
          {mood.topResistedMood && (
            <View style={styles.insightBox}>
              <Text style={styles.insightText}>
                🌟 You resist best when feeling {mood.topResistedMood}. Use that state to your advantage.
              </Text>
            </View>
          )}
        </Card>
      )}

      {mood.topSmokingMood && (
        <Card>
          <Text style={styles.cardLabel}>Watch out for</Text>
          <Text style={{ ...T.body, color: colors.textMuted, marginTop: spacing.xs }}>
            You're most likely to smoke when feeling{' '}
            <Text style={{ color: colors.danger }}>{mood.topSmokingMood}</Text>.
          </Text>
        </Card>
      )}
    </View>
  )
}

export default function InsightsScreen() {
  const [tab, setTab] = useState<Tab>('patterns')
  const { data, loading, error, refresh } = useInsights()

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.teal} />}
      >
        <Text style={styles.pageTitle}>Insights</Text>

        <View style={styles.tabRow}>
          {TABS.map((t) => (
            <Pressable key={t.key} onPress={() => setTab(t.key)} style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}>
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        {loading && !data ? (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <ActivityIndicator color={colors.teal} />
          </View>
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
})