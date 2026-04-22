import React from 'react'
import { View } from 'react-native'

type Period = '7d' | '30d' | '3m'

const CHART_HEIGHT = 52

export default function MiniBarChart({
  data, color, period
}: { data: number[]; color: string; period: Period }) {
  const max  = Math.max(...data, 1)
  const gap  = period === '3m' ? 1 : 3
  const barW = period === '7d' ? null : period === '30d' ? 7 : 3

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap, height: CHART_HEIGHT }}>
      {data.map((v, i) => (
        <View
          key={i}
          style={[
            { justifyContent: 'flex-end', height: CHART_HEIGHT },
            barW ? { width: barW } : { flex: 1 },
          ]}
        >
          <View
            style={{
              // ✅ pixel height, not percentage
              height: Math.max(Math.round((v / max) * CHART_HEIGHT), 3),
              backgroundColor: color,
              opacity: 0.8,
              borderRadius: 2,
            }}
          />
        </View>
      ))}
    </View>
  )
}