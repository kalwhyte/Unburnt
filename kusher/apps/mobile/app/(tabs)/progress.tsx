import React, { useState } from 'react'
import {
  View, Text, ScrollView,
  Pressable, RefreshControl, ActivityIndicator
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing } from '../../src/constants/theme'
import Card from '../../src/components/common/Card'
import { useProgress } from '../../src/hooks/useProgress'
import { s } from './styles.progress'
import { PERIODS, PLACEHOLDER_MILESTONES } from '../../src/components/progress/data'
import SmokeFreeRing from '../../src/components/progress/smokeFreeRing'
import DailyBars from '../../src/components/progress/dailyBars'
import MiniBarChart from '../../src/components/progress/miniBarChart'
import MilestoneList from '../../src/components/progress/milestoneList'


type Period = '7d' | '30d' | '3m'

// ── Screen ───────────────────────────────────────────────────────────────────
export default function ProgressScreen() {
  const [period, setPeriod] = useState<Period>('7d')
  const { stats: data, loading, refresh } = useProgress(period)

  const smokeFreeRate  = data?.smokeFreeRate ?? 0
  const smokeFreeDays  = data?.smokeFreeDays ?? 0
  const cigsAvoided    = data?.cigarettesAvoided ?? 0
  const longestStreak  = data?.longestStreak ?? 0
  const slipDays       = data?.slipDays ?? 0
  const moneySaved     = data?.moneySaved ?? '0'
  const projMonthly    = data?.projectedMonthly ?? '0'
  const projYearly     = data?.projectedYearly ?? '0'
  const resisted       = data?.cravingsResisted ?? 0
  const total          = data?.cravingsTotal ?? 0
  const successRate    = total > 0 ? Math.round((resisted / total) * 100) : 0
  const smoked         = total - resisted
  const milestones     = data?.milestones ?? PLACEHOLDER_MILESTONES
  const dailyBars      = data?.dailySmokeFree ?? [1,1,0,1,1,1,0,1,1,1,1,0,1,1]
  const dailyCravings  = data?.dailyCravings ?? [3,2,4,1,2,3,1,2,1,3,2,1,2,1]

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.teal} />}
      >
        <Text style={s.pageTitle}>Progress</Text>
        <Text style={s.pageSub}>Day {smokeFreeDays} smoke-free</Text>

        {/* Period toggle */}
        <View style={s.tabRow}>
          {PERIODS.map((p) => (
            <Pressable key={p.key} onPress={() => setPeriod(p.key)} style={[s.tabBtn, period === p.key && s.tabBtnActive]}>
              <Text style={[s.tabText, period === p.key && s.tabTextActive]}>{p.label}</Text>
            </Pressable>
          ))}
        </View>

        {loading && !data ? (
          <View style={s.loader}><ActivityIndicator color={colors.teal} /></View>
        ) : (
          <>
            {/* Hero card */}
            <Card style={s.card}>
              <View style={s.heroRow}>
                <SmokeFreeRing pct={smokeFreeRate} />
                <View style={s.heroStats}>
                  {[
                    { label: 'Smoke-free days',   val: smokeFreeDays,          teal: true  },
                    { label: 'Cigarettes avoided', val: cigsAvoided,           teal: true  },
                    { label: 'Longest streak',     val: `${longestStreak}d`,   teal: false },
                    { label: 'Slip days',          val: slipDays,              danger: true },
                  ].map((row, i) => (
                    <React.Fragment key={row.label}>
                      {i > 0 && <View style={s.heroDivider} />}
                      <View style={s.heroStatRow}>
                        <Text style={s.heroStatKey}>{row.label}</Text>
                        <Text style={[s.heroStatVal, row.teal && { color: colors.tealLight }, (row as any).danger && { color: colors.danger }]}>
                          {row.val}
                        </Text>
                      </View>
                    </React.Fragment>
                  ))}
                </View>
              </View>
              <View style={{ marginTop: spacing.lg }}>
                <DailyBars data={dailyBars} period={period} />
                <Text style={s.chartNote}>Each bar = 1 day (green = free, red = slip)</Text>
              </View>
            </Card>

            {/* Money saved */}
            <Card style={s.card}>
              <Text style={s.cardLabel}>MONEY SAVED</Text>
              <Text style={s.savingsAmount}>₦{moneySaved}</Text>
              <Text style={s.savingsSub}>vs what you'd have spent</Text>
              <View style={s.savingsRow}>
                {[
                  { val: `₦${projMonthly}`, lbl: 'Per month' },
                  { val: `₦${projYearly}`,  lbl: 'Per year'  },
                  { val: cigsAvoided,       lbl: 'Not smoked' },
                ].map((box) => (
                  <View key={box.lbl} style={s.savingsBox}>
                    <Text style={s.savingsBoxVal}>{box.val}</Text>
                    <Text style={s.savingsBoxLbl}>{box.lbl}</Text>
                  </View>
                ))}
              </View>
            </Card>

            {/* Cravings */}
            <Card style={s.card}>
              <Text style={s.cardLabel}>CRAVINGS</Text>
              <View style={s.cravingRow}>
                {[
                  { val: resisted,      lbl: 'Resisted', teal: true   },
                  { val: total,         lbl: 'Total',    teal: false  },
                  { val: `${successRate}%`, lbl: 'Success', teal: true },
                  { val: smoked,        lbl: 'Smoked',   danger: true },
                ].map((c, i) => (
                  <React.Fragment key={c.lbl}>
                    {i > 0 && <View style={s.cravingSep} />}
                    <View style={s.cravingStat}>
                      <Text style={[s.cravingVal, c.teal && { color: colors.tealLight }, (c as any).danger && { color: colors.danger }]}>
                        {c.val}
                      </Text>
                      <Text style={s.cravingLbl}>{c.lbl}</Text>
                    </View>
                  </React.Fragment>
                ))}
              </View>
              <MiniBarChart data={dailyCravings} color={colors.danger} period={period} />
              <Text style={s.chartNote}>Daily cravings</Text>
            </Card>

            {/* Milestones */}
            <Text style={s.sectionTitle}>MILESTONES</Text>
            <MilestoneList milestones={milestones} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
