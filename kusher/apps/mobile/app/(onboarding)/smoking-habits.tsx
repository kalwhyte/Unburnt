import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Button from '../../src/components/common/Button'
import { StepIndicator } from '../../src/components/common/StepIndicator'
import { useOnboardingStore } from '../../src/store/onboardingStore'

const TIMES = [
  { value: 'waking',  label: 'First thing after waking' },
  { value: 'coffee',  label: 'With morning coffee' },
  { value: 'break',   label: 'During work breaks' },
  { value: 'lunch',   label: 'After lunch' },
  { value: 'driving', label: 'While driving' },
  { value: 'evening', label: 'In the evening' },
  { value: 'stress',  label: 'When stressed' },
  { value: 'social',  label: 'Socially / with others' },
]

const BRAND_OPTIONS = [
  { value: 'menthol',  label: 'Menthol' },
  { value: 'light',    label: 'Light / ultra-light' },
  { value: 'regular',  label: 'Regular' },
  { value: 'rollup',   label: 'Roll-your-own' },
  { value: 'vape',     label: 'Vape / e-cig' },
  { value: 'other',    label: 'Other' },
]

export default function SmokingHabitsScreen() {
  const router = useRouter()
  const setField = useOnboardingStore((s) => s.setField)
  const [times, setTimes]   = useState<string[]>([])
  const [brand, setBrand]   = useState('')

  const toggleTime = (v: string) =>
    setTimes(prev => prev.includes(v) ? prev.filter(t => t !== v) : [...prev, v])

  const handleNext = () => {
    setField('smokingTimes', times)
    setField('cigaretteType', brand)
    router.push('/(onboarding)/triggers')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <StepIndicator current={2} total={7} />

        <Text style={styles.heading}>Your smoking habits</Text>
        <Text style={styles.sub}>Select all that apply — be honest, it helps us help you.</Text>

        <Text style={styles.label}>When do you usually smoke? <Text style={styles.multi}>(select all)</Text></Text>
        <View style={styles.chipWrap}>
          {TIMES.map((t) => (
            <Pressable
              key={t.value}
              onPress={() => toggleTime(t.value)}
              style={[styles.chip, times.includes(t.value) && styles.chipActive]}
            >
              <Text style={[styles.chipText, times.includes(t.value) && styles.chipTextActive]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>What do you usually smoke?</Text>
        <View style={styles.optionList}>
          {BRAND_OPTIONS.map((o) => (
            <Pressable
              key={o.value}
              onPress={() => setBrand(o.value)}
              style={[styles.listItem, brand === o.value && styles.listItemActive]}
            >
              <Text style={[styles.listItemText, brand === o.value && styles.listItemTextActive]}>{o.label}</Text>
              <View style={[styles.radio, brand === o.value && styles.radioActive]} />
            </Pressable>
          ))}
        </View>

        <Button title="Continue" onPress={handleNext} disabled={times.length === 0 || !brand} size="lg" />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:               { flex: 1, backgroundColor: colors.bg },
  scroll:             { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  heading:            { ...T.h1, color: colors.textPrimary, marginBottom: spacing.xs, marginTop: spacing.lg },
  sub:                { ...T.body, color: colors.textMuted, marginBottom: spacing.xxl },
  label:              { ...T.captionMedium, color: colors.textSecondary, letterSpacing: 0.4, marginBottom: spacing.md },
  multi:              { color: colors.textDim, fontWeight: '400' },
  chipWrap:           { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  chip:               { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.full, backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border },
  chipActive:         { backgroundColor: colors.tealBg, borderColor: colors.teal },
  chipText:           { ...T.bodySmall, color: colors.textMuted },
  chipTextActive:     { color: colors.tealLight },
  optionList:         { gap: spacing.sm, marginBottom: spacing.xxl },
  listItem:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  listItemActive:     { backgroundColor: colors.tealBg, borderColor: colors.teal },
  listItemText:       { ...T.body, color: colors.textMuted },
  listItemTextActive: { color: colors.tealLight },
  radio:              { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: colors.border },
  radioActive:        { borderColor: colors.teal, backgroundColor: colors.teal },
})