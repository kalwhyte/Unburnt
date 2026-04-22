import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { colors, radius, spacing } from '../../constants/theme'

type Variant = 'default' | 'elevated' | 'danger' | 'teal'

interface CardProps {
  children: React.ReactNode
  variant?: Variant
  style?: ViewStyle
  padding?: number
}

export default function Card({ children, variant = 'default', style, padding = spacing.lg }: CardProps) {
  return (
    <View style={[styles.base, styles[variant], { padding }, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  base:     { borderRadius: radius.lg, borderWidth: 0.5 },
  default:  { backgroundColor: colors.surface,    borderColor: colors.border },
  elevated: { backgroundColor: colors.surfaceAlt,  borderColor: colors.border },
  danger:   { backgroundColor: colors.dangerBg,    borderColor: colors.dangerBorder },
  teal:     { backgroundColor: colors.tealBg,      borderColor: colors.tealDark },
})