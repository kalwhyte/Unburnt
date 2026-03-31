// src/constants/theme.ts
import { TextStyle } from 'react-native'

export const colors = {
  // backgrounds
  bg:         '#0d0f14',
  surface:    '#111318',
  surfaceAlt: '#151820',
  card:       '#111318',

  // borders
  border:     '#1e2130',
  borderSoft: '#161820',

  // teal (primary accent)
  teal:       '#2d7a63',
  tealLight:  '#7eb8a4',
  tealDark:   '#1d4a3c',
  tealBg:     '#0f2420',

  // danger/craving
  danger:     '#c08090',
  dangerBg:   '#1a1020',
  dangerBorder:'#4a2040',

  // text
  textPrimary:   '#e8eaf0',
  textSecondary: '#c8d0d8',
  textMuted:     '#5a6070',
  textDim:       '#3a4050',
} as const

// Typography scale
export const T: Record<string, TextStyle> = {
  h1:         { fontSize: 26, fontWeight: '600', letterSpacing: -0.5 },
  h2:         { fontSize: 20, fontWeight: '600', letterSpacing: -0.3 },
  h3:         { fontSize: 16, fontWeight: '500' },
  body:       { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodyMedium: { fontSize: 15, fontWeight: '500' },
  bodySmall:  { fontSize: 13, fontWeight: '400', lineHeight: 20 },
  caption:    { fontSize: 12, fontWeight: '400' },
  captionMedium: { fontSize: 12, fontWeight: '500' },
  mono:       { fontSize: 12, fontFamily: 'SpaceMono' },
}

export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 32,
} as const

export const radius = {
  sm:  6,
  md:  10,
  lg:  14,
  xl:  20,
  full: 999,
} as const
