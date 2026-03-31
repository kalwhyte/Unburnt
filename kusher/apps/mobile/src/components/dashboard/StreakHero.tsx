// src/components/dashboard/StreakHero.tsx
import { View, Text, StyleSheet } from 'react-native'
import { colors, T, radius } from '../../constants/theme'

interface Props { days: number }

export function StreakHero({ days }: Props) {
  const week = Array(7).fill(0).map((_, i) => i < Math.min(days, 7))
  return (
    <View style={s.card}>
      <Text style={s.days}>{days}</Text>
      <Text style={s.label}>days smoke-free</Text>
      <View style={s.weekRow}>
        {week.map((filled, i) => (
          <View key={i} style={[s.weekBar, filled && s.weekBarFilled]} />
        ))}
      </View>
      <Text style={s.weekLabel}>This week</Text>
    </View>
  )
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.tealBg, borderWidth: 0.5, borderColor: colors.teal, borderRadius: radius.lg, padding: 20, alignItems: 'center' },
  days: { fontSize: 48, fontWeight: '600', color: colors.tealLight, lineHeight: 52 },
  label: { ...T.caption, color: '#3a6050', marginTop: 2 },
  weekRow: { flexDirection: 'row', gap: 4, marginTop: 14 },
  weekBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
  weekBarFilled: { backgroundColor: colors.teal },
  weekLabel: { ...T.caption, color: colors.textDim, marginTop: 6 },
})