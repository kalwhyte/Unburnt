import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Button from '../../src/components/common/Button'
import { StepIndicator } from '../../src/components/common/StepIndicator'
import { useOnboardingStore } from '../../src/store/onboardingStore'

const CPD_OPTIONS = [
  { value: '1-5',   label: '1–5',   desc: 'Light smoker' },
  { value: '6-10',  label: '6–10',  desc: 'Moderate' },
  { value: '11-20', label: '11–20', desc: 'Pack a day' },
  { value: '20+',   label: '20+',   desc: 'Heavy smoker' },
]

const YEARS_OPTIONS = [
  { value: '<1',  label: 'Less than a year' },
  { value: '1-3', label: '1–3 years' },
  { value: '3-10',label: '3–10 years' },
  { value: '10+', label: '10+ years' },
]


export default function SmokingProfileScreen() {
   const router = useRouter()
   const setField = useOnboardingStore((s) => s.setField)
   const [cpd, setCpd]     = useState('')
   const [years, setYears] = useState('')
 
   const canContinue = !!cpd && !!years
 
   const handleNext = () => {
     setField('cigarettesPerDay', cpd)
     setField('yearsSmoked', years)
     router.push('/(onboarding)/smoking-habits')
   }


  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <StepIndicator current={1} total={7} />

        <Text style={styles.heading}>Your smoking profile</Text>
        <Text style={styles.sub}>This helps us personalise your quit plan.</Text>

        <Text style={styles.label}>How many cigarettes per day?</Text>
        <View style={styles.optionGrid}>
          {CPD_OPTIONS.map((o) => (
            <Pressable
              key={o.value}
              onPress={() => setCpd(o.value)}
              style={[styles.optionCard, cpd === o.value && styles.optionCardActive]}
            >
              <Text style={[styles.optionLabel, cpd === o.value && styles.optionLabelActive]}>{o.label}</Text>
              <Text style={[styles.optionDesc,  cpd === o.value && styles.optionDescActive]}>{o.desc}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>How long have you smoked?</Text>
        <View style={styles.optionList}>
          {YEARS_OPTIONS.map((o) => (
            <Pressable
              key={o.value}
              onPress={() => setYears(o.value)}
              style={[styles.listItem, years === o.value && styles.listItemActive]}
            >
              <Text style={[styles.listItemText, years === o.value && styles.listItemTextActive]}>{o.label}</Text>
              <View style={[styles.radio, years === o.value && styles.radioActive]} />
            </Pressable>
          ))}
        </View>

        <Button title="Continue" onPress={handleNext} disabled={!canContinue} size="lg" style={styles.cta} />
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
  optionGrid:         { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  optionCard:         { width: '47.5%', backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  optionCardActive:   { backgroundColor: colors.tealBg, borderColor: colors.teal },
  optionLabel:        { ...T.h3, color: colors.textMuted, marginBottom: 2 },
  optionLabelActive:  { color: colors.tealLight },
  optionDesc:         { ...T.caption, color: colors.textDim },
  optionDescActive:   { color: colors.teal },
  optionList:         { gap: spacing.sm, marginBottom: spacing.xxl },
  listItem:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  listItemActive:     { backgroundColor: colors.tealBg, borderColor: colors.teal },
  listItemText:       { ...T.body, color: colors.textMuted },
  listItemTextActive: { color: colors.tealLight },
  radio:              { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: colors.border },
  radioActive:        { borderColor: colors.teal, backgroundColor: colors.teal },
  cta:                { marginTop: spacing.sm },
})