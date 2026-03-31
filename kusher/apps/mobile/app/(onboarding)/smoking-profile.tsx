// // ─────────────────────────────────────────────
// // app/(onboarding)/smoking-profile.tsx
// // ─────────────────────────────────────────────
// import { useState } from 'react'
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
// import { useRouter } from 'expo-router'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { useOnboardingStore } from '../../src/store/onboardingStore'
// import { StepIndicator } from '../../src/components/common/StepIndicator'
// import { colors, T } from '../../src/constants/theme'

// const TRIGGERS = ['Morning', 'After meals', 'Stress', 'Social', 'Driving', 'Alcohol']

// export function SmokingProfileScreen() {
//   const router = useRouter()
//   const { setProfile } = useOnboardingStore()
//   const [cigsPerDay, setCigsPerDay] = useState('')
//   const [years, setYears] = useState('')
//   const [costPerPack, setCostPerPack] = useState('')
//   const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])

//   const toggle = (t: string) =>
//     setSelectedTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

//   const onNext = () => {
//     setProfile({ cigsPerDay: Number(cigsPerDay), years: Number(years), costPerPack: Number(costPerPack), triggers: selectedTriggers })
//     router.push('/(onboarding)/quit-reason')
//   }

//   return (
//     <SafeAreaView style={s.container}>
//       <StepIndicator current={0} total={5} />
//       <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
//         <Text style={s.title}>Your smoking profile</Text>
//         <Text style={s.sub}>Help us personalise your plan</Text>

//         <View style={s.field}>
//           <Text style={s.label}>Cigarettes per day</Text>
//           <TextInput style={s.input} value={cigsPerDay} onChangeText={setCigsPerDay} keyboardType="number-pad" placeholder="e.g. 15" placeholderTextColor={colors.textDim} />
//         </View>
//         <View style={s.field}>
//           <Text style={s.label}>Years smoking</Text>
//           <TextInput style={s.input} value={years} onChangeText={setYears} keyboardType="number-pad" placeholder="e.g. 5" placeholderTextColor={colors.textDim} />
//         </View>
//         <View style={s.field}>
//           <Text style={s.label}>Cost per pack (₦)</Text>
//           <TextInput style={s.input} value={costPerPack} onChangeText={setCostPerPack} keyboardType="number-pad" placeholder="e.g. 800" placeholderTextColor={colors.textDim} />
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
// import { useState } from 'react'
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
// import { useRouter } from 'expo-router'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { useOnboardingStore } from '../../src/store/onboardingStore'
// import { StepIndicator } from '../../src/components/common/StepIndicator'
// import { colors, T } from '../../src/constants/theme'

// const TRIGGERS = ['Morning', 'After meals', 'Stress', 'Social', 'Driving', 'Alcohol']

// export default function SmokingProfileScreen() {
//   const router = useRouter()
//   const { setProfile, profile } = useOnboardingStore()
  
//   const [cigsPerDay, setCigsPerDay] = useState(profile?.cigsPerDay?.toString() || '')
//   const [years, setYears] = useState(profile?.years?.toString() || '')
//   const [costPerPack, setCostPerPack] = useState(profile?.costPerPack?.toString() || '')
//   const [selectedTriggers, setSelectedTriggers] = useState<string[]>(profile?.triggers || [])

//   const toggle = (t: string) =>
//     setSelectedTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

//   const onNext = () => {
//     if (cigsPerDay && years && costPerPack) {
//       setProfile({ 
//         cigsPerDay: Number(cigsPerDay), 
//         years: Number(years), 
//         costPerPack: Number(costPerPack), 
//         triggers: selectedTriggers 
//       })
//       router.push('/(onboarding)/reasons')
//     }
//   }

//   const isFormValid = cigsPerDay && years && costPerPack

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
//         <TouchableOpacity style={[s.btnPrimary, !isFormValid && s.btnDisabled]} onPress={onNext} disabled={!isFormValid}>
//           <Text style={s.btnPrimaryText}>Continue</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   )
// }

// const s = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.bg },
//   body: { padding: 20 },
//   title: { ...T.h1, color: colors.textPrimary, marginBottom: 4 },
//   sub: { ...T.body, color: colors.textMuted, marginBottom: 20 },
//   field: { marginBottom: 20 },
//   label: { ...T.bodyMedium, color: colors.textPrimary, marginBottom: 8 },
//   input: { backgroundColor: colors.surface, padding: 12, borderRadius: 8, color: colors.textPrimary },
//   chips: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
//   chip: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: colors.surface, borderRadius: 20, marginRight: 8, marginBottom: 8 },
//   chipSel: { backgroundColor: colors.teal },
//   chipText: { color: colors.textPrimary },
//   chipTextSel: { color: '#fff' },
//   footer: { padding: 20 },
//   btnPrimary: { backgroundColor: colors.teal, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
//   btnDisabled: { backgroundColor: colors.tealDark },
//   btnPrimaryText: { color: '#fff', ...T.h2 }
// })

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
   const { setProfile } = useOnboardingStore()
   const [cpd, setCpd]     = useState('')
   const [years, setYears] = useState('')
 
   const canContinue = !!cpd && !!years
 
   const handleNext = () => {
     setProfile({
       cigsPerDay: parseInt(cpd) || 0,
       years: parseInt(years) || 0,
       costPerPack: 0, // Will be updated in subsequent steps
       triggers: []
     })
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