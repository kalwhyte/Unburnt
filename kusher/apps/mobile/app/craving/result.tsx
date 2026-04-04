

import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Button from '../../src/components/common/Button'

export default function CravingResultScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <View style={styles.heroIcon}>
          <Text style={{ fontSize: 48 }}>💪</Text>
        </View>

        <Text style={styles.heading}>Craving defeated!</Text>
        <Text style={styles.sub}>
          You just proved to yourself that cravings pass. Every one you beat makes the next one easier.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>+1</Text>
            <Text style={styles.statLabel}>craving beaten</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>~4 min</Text>
            <Text style={styles.statLabel}>you held on</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>🔥</Text>
            <Text style={styles.statLabel}>streak safe</Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipLabel}>Remember this</Text>
          <Text style={styles.tipText}>
            "The craving you just beat was the hardest one — the one you actually faced. You are stronger than your urges."
          </Text>
        </View>

        <View style={styles.actions}>
          <Button title="Log this craving" onPress={() => router.push('/logs/craving')} variant="secondary" />
          <Button title="Back to home" onPress={() => router.replace('/(tabs)/dashboard')} />
        </View>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.bg },
  container:   { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  heroIcon:    { width: 96, height: 96, borderRadius: radius.xl, backgroundColor: colors.tealBg, borderWidth: 1, borderColor: colors.tealDark, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  heading:     { ...T.h1, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  sub:         { ...T.body, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  statsRow:    { flexDirection: 'row', backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.lg, paddingVertical: spacing.lg, width: '100%', marginBottom: spacing.xl },
  stat:        { flex: 1, alignItems: 'center' },
  statValue:   { ...T.h3, color: colors.teal, marginBottom: 2 },
  statLabel:   { ...T.caption, color: colors.textMuted, textAlign: 'center' },
  statDivider: { width: 0.5, backgroundColor: colors.border },
  tipCard:     { backgroundColor: colors.tealBg, borderWidth: 0.5, borderColor: colors.tealDark, borderRadius: radius.lg, padding: spacing.lg, width: '100%', marginBottom: spacing.xl },
  tipLabel:    { ...T.captionMedium, color: colors.teal, letterSpacing: 0.4, marginBottom: spacing.xs },
  tipText:     { ...T.body, color: colors.tealLight, lineHeight: 22, fontStyle: 'italic' },
  actions:     { gap: spacing.sm, width: '100%' },
})