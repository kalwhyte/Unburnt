// import { View } from "react-native";
// import { ReactNode } from "react";

// type CardVariant = "default" | "secondary" | "outline";
// type CardPadding = "sm" | "md" | "lg";

// interface CardProps {
//   children: ReactNode;
//   variant?: CardVariant;
//   padding?: CardPadding;
// }

// export default function Card({
//   children,
//   variant = "default",
//   padding = "md",
// }: CardProps) {
//   const base = "rounded-2xl";

//   const variants = {
//     default: "bg-[#121722]",
//     secondary: "bg-[#1a1f2b]",
//     outline: "border border-[#2a3242] bg-transparent",
//   };

//   const paddings = {
//     sm: "p-3",
//     md: "p-4",
//     lg: "p-6",
//   };

//   return (
//     <View className={`${base} ${variants[variant]} ${paddings[padding]}`}>
//       {children}
//     </View>
//   );
// }

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