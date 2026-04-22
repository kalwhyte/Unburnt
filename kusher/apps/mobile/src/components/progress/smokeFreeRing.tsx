import { View, Text } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { colors } from '../../constants/theme'
import { s } from '../../../app/(tabs)/styles.progress'

// ── Smoke-free ring ─────────────────────────────────────────────────────────
export default function SmokeFreeRing({ pct }: { pct: number }) {
  const R = 36, SIZE = 88, STROKE = 6
  const circ = 2 * Math.PI * R
  const offset = circ * (1 - Math.min(pct, 100) / 100)
  return (
    <View style={s.ringWrap}>
      <Svg width={SIZE} height={SIZE}>
        <Circle cx={SIZE/2} cy={SIZE/2} r={R} stroke={colors.tealDark} strokeWidth={STROKE} fill="none" />
        <Circle
          cx={SIZE/2} cy={SIZE/2} r={R}
          stroke={colors.teal} strokeWidth={STROKE} fill="none"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE/2} ${SIZE/2})`}
        />
      </Svg>
      <View style={s.ringCenter}>
        <Text style={s.ringVal}>{Math.round(pct)}%</Text>
        <Text style={s.ringLbl}>SMOKE-FREE</Text>
      </View>
    </View>
  )
}