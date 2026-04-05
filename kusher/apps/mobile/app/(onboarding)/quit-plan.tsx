import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Button from '../../src/components/common/Button'
import { StepIndicator } from '../../src/components/common/StepIndicator'
import { useOnboardingStore } from '../../src/store/onboardingStore'

const STRATEGIES = [
  {
    value: 'cold-turkey',
    icon: '⚡',
    title: 'Cold turkey',
    desc: 'Stop completely on your quit date. Hard but fast.',
    recommended: false,
  },
  {
    value: 'gradual',
    icon: '📉',
    title: 'Gradual reduction',
    desc: 'Cut down over 1–2 weeks before your quit date.',
    recommended: true,
  },
  {
    value: 'nrt',
    icon: '💊',
    title: 'NRT support',
    desc: 'Use patches, gum, or lozenges alongside this app.',
    recommended: false,
  },
]

const PACK_PRICES = ['$8', '$10', '$12', '$15', '$18', '$20+']

export default function QuitPlanScreen() {
  const router = useRouter()
  const { setField } = useOnboardingStore()

  const [strategy, setStrategy]   = useState('gradual')
  const [quitDate, setQuitDate]   = useState<'today' | 'week' | 'custom'>('week')
  const [packPrice, setPackPrice] = useState('$12')

  const handleNext = () => {
    setField('packPrice', packPrice)
    setField('strategy', strategy)
    setField('quitDateChoice', quitDate)
    // @ts-ignore - adding quit plan data to profile
    setField({
      quitPlan: {
        strategy, quitDateChoice: quitDate
      }
    })
    router.push('/(onboarding)/notifications-opt-in')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <StepIndicator current={5} total={7} />

        <Text style={styles.heading}>Build your quit plan</Text>
        <Text style={styles.sub}>Choose what works for you — there's no single right way.</Text>

        {/* Strategy */}
        <Text style={styles.label}>Quitting strategy</Text>
        <View style={styles.strategies}>
          {STRATEGIES.map((s) => (
            <Pressable
              key={s.value}
              onPress={() => setStrategy(s.value)}
              style={[styles.stratCard, strategy === s.value && styles.stratCardActive]}
            >
              <View style={styles.stratHeader}>
                <Text style={styles.stratIcon}>{s.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.stratTitle, strategy === s.value && styles.stratTitleActive]}>
                    {s.title}
                  </Text>
                  {s.recommended && (
                    <View style={styles.recBadge}><Text style={styles.recText}>Recommended</Text></View>
                  )}
                </View>
                <View style={[styles.radio, strategy === s.value && styles.radioActive]} />
              </View>
              <Text style={styles.stratDesc}>{s.desc}</Text>
            </Pressable>
          ))}
        </View>

        {/* Quit date */}
        <Text style={styles.label}>Quit date</Text>
        <View style={styles.dateRow}>
          {([
            { k: 'today', l: 'Today' },
            { k: 'week',  l: 'In 1 week' },
            { k: 'custom',l: 'Pick a date' },
          ] as const).map((d) => (
            <Pressable
              key={d.k}
              onPress={() => setQuitDate(d.k)}
              style={[styles.dateBtn, quitDate === d.k && styles.dateBtnActive]}
            >
              <Text style={[styles.dateBtnText, quitDate === d.k && styles.dateBtnTextActive]}>{d.l}</Text>
            </Pressable>
          ))}
        </View>

        {/* Pack price */}
        <Text style={styles.label}>Cost per pack</Text>
        <Text style={styles.hint}>Used to calculate your money saved.</Text>
        <View style={styles.priceRow}>
          {PACK_PRICES.map((p) => (
            <Pressable
              key={p}
              onPress={() => setPackPrice(p)}
              style={[styles.priceBtn, packPrice === p && styles.priceBtnActive]}
            >
              <Text style={[styles.priceBtnText, packPrice === p && styles.priceBtnTextActive]}>{p}</Text>
            </Pressable>
          ))}
        </View>

        <Button title="Continue" onPress={handleNext} size="lg" style={{ marginTop: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:                { flex: 1, backgroundColor: colors.bg },
  scroll:              { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  heading:             { ...T.h1, color: colors.textPrimary, marginBottom: spacing.xs, marginTop: spacing.lg },
  sub:                 { ...T.body, color: colors.textMuted, marginBottom: spacing.xl },
  label:               { ...T.captionMedium, color: colors.textSecondary, letterSpacing: 0.4, marginBottom: spacing.sm },
  hint:                { ...T.caption, color: colors.textMuted, marginTop: -spacing.xs, marginBottom: spacing.sm },
  strategies:          { gap: spacing.sm, marginBottom: spacing.xl },
  stratCard:           { backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md },
  stratCardActive:     { backgroundColor: colors.tealBg, borderColor: colors.teal },
  stratHeader:         { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xs },
  stratIcon:           { fontSize: 22 },
  stratTitle:          { ...T.bodyMedium, color: colors.textMuted },
  stratTitleActive:    { color: colors.tealLight },
  stratDesc:           { ...T.caption, color: colors.textDim, marginLeft: 38 },
  recBadge:            { backgroundColor: colors.tealDark, borderRadius: radius.sm, paddingVertical: 1, paddingHorizontal: 6, alignSelf: 'flex-start', marginTop: 2 },
  recText:             { ...T.caption, color: colors.tealLight, fontSize: 10 },
  radio:               { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: colors.border },
  radioActive:         { borderColor: colors.teal, backgroundColor: colors.teal },
  dateRow:             { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  dateBtn:             { flex: 1, paddingVertical: spacing.md, backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, alignItems: 'center' },
  dateBtnActive:       { backgroundColor: colors.tealBg, borderColor: colors.teal },
  dateBtnText:         { ...T.bodySmall, color: colors.textMuted },
  dateBtnTextActive:   { color: colors.tealLight },
  priceRow:            { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  priceBtn:            { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md },
  priceBtnActive:      { backgroundColor: colors.tealBg, borderColor: colors.teal },
  priceBtnText:        { ...T.bodySmall, color: colors.textMuted },
  priceBtnTextActive:  { color: colors.tealLight },
})