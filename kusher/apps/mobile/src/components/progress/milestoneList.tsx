import React from 'react'
import { StyleSheet } from 'react-native'
import { View, Text } from 'react-native'
import { colors, spacing } from '../../constants/theme'
import { Badge } from '../../components/common/Badge'
// import { s } from './styles.progress'
import { PLACEHOLDER_MILESTONES } from './data'


// ── Milestone list ───────────────────────────────────────────────────────────
export default function MilestoneList({ milestones }: { milestones: typeof PLACEHOLDER_MILESTONES }) {
  return (
    <View>
      {milestones.map((m, i) => {
        const isLast = i === milestones.length - 1
        const isNext = !m.achieved && milestones[i - 1]?.achieved
        return (
          <View key={m.id} style={s.milestoneRow}>
            <View style={s.milestoneTrack}>
              <View style={[
                s.milestoneCircle,
                m.achieved && s.milestoneCircleDone,
                isNext && s.milestoneCircleNext,
              ]}>
                {m.achieved && <View style={s.milestoneCheck} />}
                {isNext && !m.achieved && <View style={s.milestoneDot} />}
              </View>
              {!isLast && (
                <View style={[s.milestoneConnector, m.achieved && s.milestoneConnectorDone]} />
              )}
            </View>

            <View style={[s.milestoneBody, isLast && { paddingBottom: 0 }]}>
              <Text style={[
                s.milestoneTitle,
                m.achieved && s.milestoneTitleDone,
                isNext && s.milestoneTitleNext,
              ]}>
                {m.title}
              </Text>
              <Text style={s.milestoneSub}>{m.subtitle}</Text>

              {m.achievedAt && (
                <Badge label={m.achievedAt} variant="success" size="sm" style={{ marginTop: spacing.xs, alignSelf: 'flex-start' }} />
              )}

              {!m.achieved && m.progress !== undefined && (
                <View style={s.milestoneProgressRow}>
                  <View style={s.milestoneProgressTrack}>
                    <View style={[s.milestoneProgressFill, { width: `${m.progress}%` as any }]} />
                  </View>
                  <Text style={s.milestoneProgressPct}>{m.progress}%</Text>
                </View>
              )}

              {!m.achieved && m.progress === undefined && !m.achievedAt && (
                <Badge label="Upcoming" variant="primary" size="sm" style={{ marginTop: spacing.xs, alignSelf: 'flex-start' }} />
              )}
            </View>
          </View>
        )
      })}
    </View>
  )
}

// ── Local styles (no longer depends on styles.progress) ──────────────────────
const s = StyleSheet.create({
  milestoneRow:          { flexDirection: 'row', gap: spacing.md },
  milestoneTrack:        { alignItems: 'center' },
  milestoneCircle:       { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  milestoneCircleDone:   { backgroundColor: colors.teal, borderColor: colors.teal },
  milestoneCircleNext:   { borderColor: colors.teal },
  milestoneCheck:        { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  milestoneDot:          { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.teal },
  milestoneConnector:    { width: 1.5, flex: 1, minHeight: 20, backgroundColor: colors.border, marginVertical: 3 },
  milestoneConnectorDone:{ backgroundColor: colors.teal },
  milestoneBody:         { flex: 1, paddingBottom: spacing.lg },
  milestoneTitle:        { fontSize: 13, fontWeight: '500', color: colors.textMuted, marginBottom: 2 },
  milestoneTitleDone:    { color: colors.textPrimary },
  milestoneTitleNext:    { color: colors.tealLight },
  milestoneSub:          { fontSize: 12, color: colors.textDim, marginBottom: 2 },
  milestoneProgressRow:  { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  milestoneProgressTrack:{ width: 80, height: 3, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  milestoneProgressFill: { height: '100%', backgroundColor: colors.teal, borderRadius: 2 },
  milestoneProgressPct:  { fontSize: 12, color: colors.textMuted },
})