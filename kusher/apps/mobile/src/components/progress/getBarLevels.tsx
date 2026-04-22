type Period = '7d' | '30d' | '3m'

// Generate labels for daily bars based on period and data length
export function getBarLabels(period: Period, dataLength: number) {
  if (period === '7d') {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, dataLength)
  }
  if (period === '30d') {
    return Array.from({ length: dataLength }, (_, i) =>
      i % 7 === 0 ? `W${Math.floor(i / 7) + 1}` : ''
    )
  }
  return Array.from({ length: dataLength }, (_, i) =>
    i % 30 === 0 ? ['M1','M2','M3'][Math.floor(i / 30)] : ''
  )
}