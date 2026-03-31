// // app/(onboarding)/_layout.tsx
// import { Stack } from 'expo-router'

// export default function OnboardingLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0d0f14' }, animation: 'slide_from_right' }}>
//       <Stack.Screen name="smoking-profile" />
//       <Stack.Screen name="quit-reason" />
//       <Stack.Screen name="quit-plan" />
//       <Stack.Screen name="quit-date" />
//       <Stack.Screen name="notifications-opt-in" />
//       <Stack.Screen name="all-set" />
//     </Stack>
//   )
// }

// ─────────────────────────────────────────────
// app/(onboarding)/smoking-profile.tsx
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// app/(onboarding)/notifications-opt-in.tsx
// ─────────────────────────────────────────────
// import * as Notifications from 'expo-notifications'
// import { registerForPushNotificationsAsync } from '@/services/notifications/expoNotifications'

// export function NotificationsOptInScreen() {
//   const router = useRouter();

//   const handleEnable = async () => {
//     const token = await registerForPushNotificationsAsync()
//     if (token) {
//       // Save token via services/api/notifications.ts
//     }
//     router.push('/(onboarding)/all-set')
//   }

//   return (
//     <SafeAreaView style={s.container}>
//       <StepIndicator current={4} total={5} />
//       <View style={s.body}>
//         <View style={s.notifIcon}>{/* Bell icon */}</View>
//         <Text style={s.title}>Stay supported</Text>
//         <Text style={s.sub}>Enable notifications so we can cheer you on,{'\n'}alert you when cravings peak and celebrate your wins.</Text>
//         <View style={s.bulletCard}>
//           {['Daily check-in reminders', 'Milestone celebrations', 'Craving peak alerts', 'Weekly progress summaries'].map(b => (
//             <View key={b} style={s.bullet}>
//               <View style={s.bulletDot} />
//               <Text style={s.bulletText}>{b}</Text>
//             </View>
//           ))}
//         </View>
//       </View>
//       <View style={s.footer}>
//         <TouchableOpacity style={s.btnPrimary} onPress={handleEnable}>
//           <Text style={s.btnPrimaryText}>Enable notifications</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => router.push('/(onboarding)/all-set')}>
//           <Text style={s.skipText}>Maybe later</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   )
// }

// const s = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.bg },
//   body: { flex: 1, padding: 20 },
//   title: { ...T.h2, color: colors.textPrimary, marginBottom: 4 },
//   sub: { ...T.body, color: colors.textMuted, marginBottom: 20 },
//   field: { marginBottom: 14 },
//   label: { ...T.caption, color: colors.textMuted, marginBottom: 4 },
//   input: { backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: 10, height: 44, paddingHorizontal: 14, color: colors.textPrimary, ...T.body },
//   chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
//   chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 0.5, borderColor: colors.border, backgroundColor: colors.surface },
//   chipSel: { backgroundColor: colors.tealDark, borderColor: colors.teal },
//   chipText: { ...T.caption, color: colors.textMuted },
//   chipTextSel: { color: colors.tealLight },
//   footer: { padding: 20, gap: 10 },
//   btnPrimary: { backgroundColor: colors.teal, borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center' },
//   btnPrimaryText: { ...T.bodyMedium, color: colors.textPrimary },
//   notifIcon: { width: 56, height: 56, backgroundColor: colors.surface, borderRadius: 18, alignSelf: 'center', marginBottom: 16, marginTop: 40 },
//   bulletCard: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 16, gap: 10, marginTop: 16 },
//   bullet: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.teal },
//   bulletText: { ...T.body, color: colors.textSecondary },
//   skipText: { ...T.caption, color: colors.textDim, textAlign: 'center' },
// })
