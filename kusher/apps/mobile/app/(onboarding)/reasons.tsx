// import { useState } from 'react'
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
// import { useRouter } from 'expo-router'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { useOnboardingStore } from '../../src/store/onboardingStore'
// import { StepIndicator } from '../../src/components/common/StepIndicator'
// import { colors, T } from '../../src/constants/theme'

// const REASONS = [
//   { id: 'health', label: 'Improve my health', icon: '🫁' },
//   { id: 'money', label: 'Save money', icon: '💰' },
//   { id: 'family', label: 'For my family', icon: '👨‍👩‍👧' },
//   { id: 'fitness', label: 'Better fitness', icon: '🏃‍♂️' },
//   { id: 'freedom', label: 'Break the addiction', icon: '🔓' },
//   { id: 'appearance', label: 'Look & smell better', icon: '✨' },
// ]

// export default function QuitReasonScreen() {
//   const router = useRouter()
//   const { setQuitReason, quitReason } = useOnboardingStore()
//   const [selected, setSelected] = useState<string | null>(quitReason)

//   const onNext = () => {
//     if (selected) {
//       setQuitReason(selected)
//       router.push('/(onboarding)/quit-plan')
//     }
//   }

//   return (
//     <SafeAreaView style={s.container}>
//       <StepIndicator current={1} total={5} />
//       <ScrollView contentContainerStyle={s.body}>
//         <Text style={s.title}>What's your main motivation?</Text>
//         <Text style={s.sub}>This helps us keep you focused when things get tough.</Text>

//         <View style={s.grid}>
//           {REASONS.map((r) => (
//             <TouchableOpacity
//               key={r.id}
//               style={[s.card, selected === r.id && s.cardSel]}
//               onPress={() => setSelected(r.id)}
//             >
//               <Text style={s.icon}>{r.icon}</Text>
//               <Text style={s.label}>{r.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <TouchableOpacity style={[s.nextButton, !selected && s.nextButtonDisabled]} onPress={onNext} disabled={!selected}>
//           <Text style={s.nextButtonText}>Next</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// const s = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.bg },
//   body: { padding: 20, flexGrow: 1, justifyContent: 'space-between' },
//   title: { ...T.h1, color: colors.textPrimary, marginBottom: 8 },
//   sub: { ...T.body, color: colors.textMuted, marginBottom: 20 },
//   grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
//   card: { width: '48%', backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 16, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
//   cardSel: { borderColor: colors.teal },
//   icon: { fontSize: 32, marginBottom: 12 },
//   label: { ...T.bodyMedium, color: colors.textPrimary, textAlign: 'center' },
//   nextButton: { backgroundColor: colors.teal, borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
//   nextButtonDisabled: { backgroundColor: colors.tealLight },
//   nextButtonText: { ...T.bodyMedium, color: colors.textPrimary },
// })

import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Button from '../../src/components/common/Button'
import {StepIndicator } from '../../src/components/common/StepIndicator'
import { useOnboardingStore } from '../../src/store/onboardingStore'

const PRESET_REASONS = [
  { value: 'health',   icon: '❤️',  label: 'My health' },
  { value: 'family',   icon: '👨‍👩‍👧', label: 'My family' },
  { value: 'money',    icon: '💰',  label: 'Save money' },
  { value: 'fitness',  icon: '🏃',  label: 'Get fitter' },
  { value: 'smell',    icon: '👃',  label: 'Smell better' },
  { value: 'pregnancy',icon: '🤰',  label: 'Pregnancy' },
  { value: 'social',   icon: '👥',  label: 'Social pressure' },
  { value: 'future',   icon: '🌅',  label: 'My future' },
]

export default function ReasonsScreen() {
  const router = useRouter()
  const { setProfile } = useOnboardingStore()
  const [selected, setSelected] = useState<string[]>([])
  const [custom, setCustom]     = useState('')

  const toggle = (v: string) =>
    setSelected(prev => prev.includes(v) ? prev.filter(r => r !== v) : [...prev, v])

  const handleNext = () => {
    setProfile({
      triggers: [],
      cigsPerDay: 0,
      years: 0,
      costPerPack: 0,
      // @ts-ignore - adding reasons to profile
      reasons: [...selected, ...(custom.trim() ? [custom.trim()] : [])]
    })
    router.push('/(onboarding)/quit-plan')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <StepIndicator current={4} total={7} />

        <Text style={styles.heading}>Why do you want to quit?</Text>
        <Text style={styles.sub}>
          Your reasons are your fuel. We'll remind you of these when it gets hard.
        </Text>

        <View style={styles.grid}>
          {PRESET_REASONS.map((r) => {
            const active = selected.includes(r.value)
            return (
              <Pressable
                key={r.value}
                onPress={() => toggle(r.value)}
                style={[styles.reasonCard, active && styles.reasonCardActive]}
              >
                <Text style={styles.reasonIcon}>{r.icon}</Text>
                <Text style={[styles.reasonLabel, active && styles.reasonLabelActive]}>{r.label}</Text>
                {active && <View style={styles.checkBadge}><Text style={styles.checkText}>✓</Text></View>}
              </Pressable>
            )
          })}
        </View>

        <Text style={styles.label}>Add your own reason (optional)</Text>
        <TextInput
          style={styles.input}
          value={custom}
          onChangeText={setCustom}
          placeholder="e.g. I want to run a 5K"
          placeholderTextColor={colors.textDim}
          returnKeyType="done"
          maxLength={120}
        />

        <Button
          title={selected.length > 0 ? `Continue — ${selected.length} reason${selected.length > 1 ? 's' : ''}` : 'Continue'}
          onPress={handleNext}
          disabled={selected.length === 0}
          size="lg"
          style={{ marginTop: spacing.xl }}
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
  reasonCard:         { width: '47.5%', backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', gap: spacing.xs, position: 'relative' },
  reasonCardActive:   { backgroundColor: colors.tealBg, borderColor: colors.teal },
  reasonIcon:         { fontSize: 26 },
  reasonLabel:        { ...T.caption, color: colors.textMuted, textAlign: 'center' },
  reasonLabelActive:  { color: colors.tealLight },
  checkBadge:         { position: 'absolute', top: 6, right: 8 },
  checkText:          { fontSize: 11, color: colors.teal },
  label:              { ...T.captionMedium, color: colors.textSecondary, letterSpacing: 0.4, marginBottom: spacing.sm },
  input:              { backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, ...T.body, color: colors.textPrimary },
})