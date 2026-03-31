import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Button from '../../src/components/common/Button'
import { StepIndicator } from '../../src/components/common/StepIndicator'
import { useOnboardingStore } from '../../src/store/onboardingStore'

const TRIGGERS = [
  { value: 'stress',     icon: '😤', label: 'Stress / anxiety' },
  { value: 'boredom',    icon: '😐', label: 'Boredom' },
  { value: 'alcohol',    icon: '🍺', label: 'Drinking alcohol' },
  { value: 'coffee',     icon: '☕', label: 'Coffee / tea' },
  { value: 'aftermeal',  icon: '🍽️', label: 'After meals' },
  { value: 'social',     icon: '👥', label: 'Social situations' },
  { value: 'driving',    icon: '🚗', label: 'Driving' },
  { value: 'work',       icon: '💼', label: 'Work pressure' },
  { value: 'phone',      icon: '📱', label: 'On the phone' },
  { value: 'breaktime',  icon: '⏸️', label: 'Break time' },
  { value: 'sadness',    icon: '😔', label: 'Sadness / low mood' },
  { value: 'habit',      icon: '🔄', label: 'Pure habit' },
]

export default function TriggersScreen() {
  const router = useRouter()
  const { setProfile } = useOnboardingStore()
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (v: string) =>
    setSelected(prev => prev.includes(v) ? prev.filter(t => t !== v) : [...prev, v])

  const handleNext = () => {
    setProfile({
      triggers: selected,
      cigsPerDay: 0,
      years: 0,
      costPerPack: 0
    })
    router.push('/(onboarding)/reasons')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <StepIndicator current={3} total={7} />

        <Text style={styles.heading}>What triggers your cravings?</Text>
        <Text style={styles.sub}>
          Knowing your triggers is the #1 predictor of quitting success.{'\n'}Select all that apply.
        </Text>

        <View style={styles.grid}>
          {TRIGGERS.map((t) => {
            const active = selected.includes(t.value)
            return (
              <Pressable
                key={t.value}
                onPress={() => toggle(t.value)}
                style={[styles.triggerCard, active && styles.triggerCardActive]}
              >
                <Text style={styles.triggerIcon}>{t.icon}</Text>
                <Text style={[styles.triggerLabel, active && styles.triggerLabelActive]}>{t.label}</Text>
              </Pressable>
            )
          })}
        </View>

        <Button
          title={selected.length > 0 ? `Continue with ${selected.length} trigger${selected.length > 1 ? 's' : ''}` : 'Continue'}
          onPress={handleNext}
          disabled={selected.length === 0}
          size="lg"
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:               { flex: 1, backgroundColor: colors.bg },
  scroll:             { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  heading:            { ...T.h1, color: colors.textPrimary, marginBottom: spacing.xs, marginTop: spacing.lg },
  sub:                { ...T.body, color: colors.textMuted, lineHeight: 22, marginBottom: spacing.xl },
  grid:               { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  triggerCard:        { width: '47.5%', backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', gap: spacing.xs },
  triggerCardActive:  { backgroundColor: colors.tealBg, borderColor: colors.teal },
  triggerIcon:        { fontSize: 24 },
  triggerLabel:       { ...T.caption, color: colors.textMuted, textAlign: 'center' },
  triggerLabelActive: { color: colors.tealLight },
})