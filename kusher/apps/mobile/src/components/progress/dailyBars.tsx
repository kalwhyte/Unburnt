import React from 'react'
import { View, Text } from 'react-native'
import { colors } from '../../../src/constants/theme'
import { getBarLabels } from './getBarLevels';
import { s } from './styles.progress'

type Period = '7d' | '30d' | '3m'
const CHART_HEIGHT = 52

export default function DailyBars({ data, period }: { data: number[]; period: Period }) {
  const labels = getBarLabels(period, data.length) ?? []
  const gap = period === '3m' ? 1 : 3
  const barWidth = period === '7d' ? undefined : period === '30d' ? 7 : 3

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap, height: CHART_HEIGHT }}>
        {data.map((v, i) => (
          <View
            key={i}
            style={[
              { justifyContent: 'flex-end', height: CHART_HEIGHT },
              barWidth ? { width: barWidth } : { flex: 1 },
            ]}
          >
            <View
              style={{
                height: Math.max(Math.round((v === 1 ? 1 : 0.18) * CHART_HEIGHT), 3),
                backgroundColor: v === 1 ? colors.teal : colors.danger,
                opacity: v === 1 ? 1 : 0.45,
                borderRadius: 2,
              }}
            />
          </View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap, marginTop: 4 }}>
        {labels.map((lbl, i) => (
          <View
            key={i}
            style={[
              { alignItems: 'center' },
              barWidth ? { width: barWidth } : { flex: 1 },
            ]}
          >
            {lbl ? (
              <Text style={{ fontSize: period === '7d' ? 9 : 8, color: '#3a4050' }}>
                {lbl}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  )
}