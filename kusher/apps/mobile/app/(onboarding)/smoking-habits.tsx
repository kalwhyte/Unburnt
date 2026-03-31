// import { useState } from 'react'
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
// import { useRouter } from 'expo-router'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { useOnboardingStore } from '../../src/store/onboardingStore'
// import { StepIndicator } from '../../src/components/common/StepIndicator'
// import { colors, T } from '../../src/constants/theme'

// const TRIGGERS = ['Morning', 'After meals', 'Stress', 'Social', 'Driving', 'Alcohol']

// export default function SmokingHabitsScreen() {
//   const router = useRouter()
//   const { setProfile } = useOnboardingStore()
//   const [cigsPerDay, setCigsPerDay] = useState('')
//   const [years, setYears] = useState('')
//   const [costPerPack, setCostPerPack] = useState('')
//   const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])

//   const toggle = (t: string) =>
//     setSelectedTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

//   const onNext = () => {
//     setProfile({ 
//       cigsPerDay: Number(cigsPerDay), 
//       years: Number(years), 
//       costPerPack: Number(costPerPack), 
//       triggers: selectedTriggers 
//     })
//     router.push('/(onboarding)/reasons')
//   }

//   return (
//     <SafeAreaView style={s.container}>
//       <StepIndicator current={0} total={5} />
//       <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
//         <Text style={s.title}>Your smoking profile</Text>
//         <Text style={s.sub}>Help us personalise your plan</Text>

//         <View style={s.field}>
//           <Text style={s.label}>Cigarettes per day</Text>
//           <TextInput 
//             style={s.input} 
//             value={cigsPerDay} 
//             onChangeText={setCigsPerDay} 
//             keyboardType="number-pad" 
//             placeholder="e.g. 15" 
//             placeholderTextColor={colors.textDim} 
//           />
//         </View>
//         <View style={s.field}>
//           <Text style={s.label}>Years smoking</Text>
//           <TextInput 
//             style={s.input} 
//             value={years} 
//             onChangeText={setYears} 
//             keyboardType="number-pad" 
//             placeholder="e.g. 5" 
//             placeholderTextColor={colors.textDim} 
//           />
//         </View>
//         <View style={s.field}>
//           <Text style={s.label}>Cost per pack (₦)</Text>
//           <TextInput 
//             style={s.input} 
//             value={costPerPack} 
//             onChangeText={setCostPerPack} 
//             keyboardType="number-pad" 
//             placeholder="e.g. 800" 
//             placeholderTextColor={colors.textDim} 
//           />
//         </View>
//         <View style={s.field}>
//           <Text style={s.label}>When do you smoke most?</Text>
//           <View style={s.chips}>
//             {TRIGGERS.map(t => (
//               <TouchableOpacity key={t} style={[s.chip, selectedTriggers.includes(t) && s.chipSel]} onPress={() => toggle(t)}>
//                 <Text style={[s.chipText, selectedTriggers.includes(t) && s.chipTextSel]}>{t}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       </ScrollView>
//       <View style={s.footer}>
//         <TouchableOpacity style={s.btnPrimary} onPress={onNext}>
//           <Text style={s.btnPrimaryText}>Continue</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   )
// }

// const s = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.bg },
//   body: { padding: 20 },
//   title: { ...T.h1, color: colors.textPrimary, marginBottom: 8 },
//   sub: { ...T.body, color: colors.textMuted, marginBottom: 20 },
//   field: { marginBottom: 20 },
//   label: { ...T.bodyMedium, color: colors.textPrimary, marginBottom: 6 },
//   input: { 
//     backgroundColor: colors.surface, 
//     paddingHorizontal: 15, 
//     height: 48, 
//     borderRadius: 10, 
//     color: colors.textPrimary, 
//     ...T.body 
//   },
//   chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
//   chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: colors.surface },
//   chipSel: { backgroundColor: colors.teal },
//   chipText: { ...T.body, color: colors.textPrimary },
//   chipTextSel: { color: colors.textPrimary },
//   footer: { padding: 20 },
//   btnPrimary: { backgroundColor: colors.teal, borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center' },
//   btnPrimaryText: { ...T.bodyMedium, color: colors.textPrimary },
// })

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
  const { setProfile } = useOnboardingStore()
  const [times, setTimes]   = useState<string[]>([])
  const [brand, setBrand]   = useState('')

  const toggleTime = (v: string) =>
    setTimes(prev => prev.includes(v) ? prev.filter(t => t !== v) : [...prev, v])

  const handleNext = () => {
    // @ts-ignore - updating profile with habit data
    setProfile({ smokingTimes: times, cigaretteType: brand })
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