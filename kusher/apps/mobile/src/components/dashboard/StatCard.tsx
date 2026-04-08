import { View, Text, StyleSheet } from 'react-native'
import { colors, T, radius } from '../../constants/theme'

interface StatProps { label: string; value: string; unit?: string; icon?: string }

export function StatCard({ label, value, unit, icon }: StatProps) {
  return (
    <View style={sc.card}>
      {icon && <Text style={sc.icon}>{icon}</Text>}
      <Text style={sc.value}>{value}</Text>
      <Text style={sc.label}>{label}</Text>
    </View>
  )
}

const sc = StyleSheet.create({
  card: { flex: 1, backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, padding: 10, alignItems: 'center' },
  value: { fontSize: 16, fontWeight: '600', color: colors.tealLight },
  label: { ...T.caption, color: colors.textDim, marginTop: 2, textAlign: 'center' },
  icon: { fontSize: 24, marginBottom: 4 },
})