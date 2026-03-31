// // app/craving-rescue.tsx  —  Modal screen
// import { useState, useEffect, useRef } from 'react'
// import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
// import { useRouter } from 'expo-router'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { CravingTimer } from '../src/components/rescue/CravingTimer'
// import { BreathingTechnique } from '../src/components/rescue/BreathingTechnique\''
// import { logCravingOutcome } from '@/services/api/cravings'
// import { colors, T } from '@/constants/theme'

// const CRAVING_DURATION_SEC = 300 // 5 min

// export default function CravingRescueScreen() {
//   const router = useRouter()
//   const [outcome, setOutcome] = useState<'resisted' | 'smoked' | null>(null)
//   const [secondsLeft, setSecondsLeft] = useState(CRAVING_DURATION_SEC)
//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

//   useEffect(() => {
//     timerRef.current = setInterval(() => {
//       setSecondsLeft(s => {
//         if (s <= 1) { clearInterval(timerRef.current!); return 0 }
//         return s - 1
//       })
//     }, 1000)
//     return () => clearInterval(timerRef.current!)
//   }, [])

//   const handleOutcome = async (result: 'resisted' | 'smoked') => {
//     setOutcome(result)
//     await logCravingOutcome(result, result === 'resisted')
//     setTimeout(() => router.back(), 1200)
//   }

//   const progress = (CRAVING_DURATION_SEC - secondsLeft) / CRAVING_DURATION_SEC
//   const mins = Math.floor(secondsLeft / 60)
//   const secs = secondsLeft % 60

//   return (
//     <SafeAreaView style={s.container}>
//       <View style={s.header}>
//         <Text style={s.alertLabel}>Craving alert</Text>
//         <Text style={s.title}>You've got this.</Text>
//         <Text style={s.sub}>Cravings last about 5 minutes. Hold on.</Text>
//       </View>

//       <CravingTimer
//         progress={progress}
//         label={`${mins}:${String(secs).padStart(2, '0')}`}
//         sublabel="remaining"
//       />

//       <View style={s.techniques}>
//         <BreathingTechnique
//           name="4-7-8 breathing"
//           description="Inhale 4s · hold 7s · exhale 8s. Repeat 3 times."
//           active
//         />
//         <TouchableOpacity style={s.techniqueCard}>
//           <Text style={s.techniqueName}>Distract yourself</Text>
//           <Text style={s.techniqueDesc}>Walk, drink water, text a friend.</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={s.techniqueCard}>
//           <Text style={s.techniqueName}>Remind yourself why</Text>
//           <Text style={s.techniqueDesc}>Think of the reason you chose to quit.</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={s.outcomeRow}>
//         <TouchableOpacity
//           style={[s.outcomeBtn, s.outcomeBtnSuccess, outcome === 'resisted' && s.outcomeBtnActive]}
//           onPress={() => handleOutcome('resisted')}
//         >
//           <Text style={s.outcomeBtnSuccessText}>I resisted ✓</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[s.outcomeBtn, s.outcomeBtnFail]}
//           onPress={() => handleOutcome('smoked')}
//         >
//           <Text style={s.outcomeBtnFailText}>I smoked</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   )
// }

// const s = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.bg, padding: 20 },
//   header: { alignItems: 'center', marginBottom: 20 },
//   alertLabel: { ...T.caption, color: '#c08090', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
//   title: { ...T.h1, color: colors.textPrimary, marginBottom: 4 },
//   sub: { ...T.body, color: colors.textMuted, textAlign: 'center' },
//   techniques: { gap: 8, marginBottom: 20 },
//   techniqueCard: { backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: 10, padding: 12 },
//   techniqueName: { ...T.bodyMedium, color: colors.textSecondary, marginBottom: 2 },
//   techniqueDesc: { ...T.caption, color: colors.textMuted, lineHeight: 18 },
//   outcomeRow: { flexDirection: 'row', gap: 10 },
//   outcomeBtn: { flex: 1, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
//   outcomeBtnSuccess: { backgroundColor: colors.tealDark },
//   outcomeBtnSuccessText: { ...T.bodyMedium, color: colors.tealLight },
//   outcomeBtnActive: { borderWidth: 1.5, borderColor: colors.teal },
//   outcomeBtnFail: { backgroundColor: '#1a1020', borderWidth: 0.5, borderColor: '#4a2040' },
//   outcomeBtnFailText: { ...T.bodyMedium, color: '#c08090' },
// })

import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Pressable, Animated, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../src/constants/theme'

const TECHNIQUES = [
  { id: 'breathing', icon: '🌬️', title: '4-7-8 Breathing',     desc: 'Calm your nervous system in under 2 minutes', duration: '2 min', route: '/craving/breathing' },
  { id: 'distract',  icon: '🧠', title: 'Distraction technique', desc: 'Name 5 things you can see right now',           duration: '1 min', route: '/craving/rescue' },
  { id: 'urge-surf', icon: '🏄', title: 'Urge surfing',          desc: 'Ride the wave — cravings peak and pass',        duration: '5 min', route: '/craving/rescue' },
  { id: 'delay',     icon: '⏱️', title: 'Delay & distract',      desc: 'Tell yourself: just 10 more minutes',           duration: '10 min',route: '/craving/rescue' },
]

export default function CravingRescueScreen() {
  const router    = useRouter()
  const fadeAnim  = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
    ]).start()
  }, [])

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.handle} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          <View style={styles.header}>
            <View style={styles.sosIcon}><Text style={{ fontSize: 28 }}>🆘</Text></View>
            <Text style={styles.heading}>Craving rescue</Text>
            <Text style={styles.sub}>Cravings last 3–5 minutes. Pick a technique and ride it out.</Text>
          </View>

          <View style={styles.intensityCard}>
            <Text style={styles.intensityLabel}>How strong is this craving?</Text>
            <View style={styles.intensityRow}>
              {[1,2,3,4,5].map((n) => (
                <Pressable key={n} style={styles.intensityBtn}>
                  <Text style={styles.intensityNum}>{n}</Text>
                </Pressable>
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.intensityHint}>Mild</Text>
              <Text style={styles.intensityHint}>Intense</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Choose a rescue technique</Text>
          <View style={styles.techniques}>
            {TECHNIQUES.map((t) => (
              <Pressable key={t.id} style={styles.techniqueCard} onPress={() => router.push(t.route as any)}>
                <View style={styles.techniqueIcon}><Text style={{ fontSize: 22 }}>{t.icon}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.techniqueTitle}>{t.title}</Text>
                  <Text style={styles.techniqueDesc}>{t.desc}</Text>
                </View>
                <View style={styles.durationBadge}><Text style={styles.durationText}>{t.duration}</Text></View>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.logBtn} onPress={() => router.push('/logs/craving')}>
            <Text style={styles.logBtnText}>📝 Log this craving instead</Text>
          </Pressable>
          <Pressable style={styles.closeBtn} onPress={() => router.back()}>
            <Text style={styles.closeBtnText}>I'm okay now</Text>
          </Pressable>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: colors.surface },
  handle:         { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginTop: spacing.sm, marginBottom: spacing.md },
  scroll:         { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  header:         { alignItems: 'center', marginBottom: spacing.xl },
  sosIcon:        { width: 64, height: 64, borderRadius: radius.xl, backgroundColor: colors.dangerBg, borderWidth: 1, borderColor: colors.dangerBorder, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  heading:        { ...T.h1, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.xs },
  sub:            { ...T.body, color: colors.textMuted, textAlign: 'center', lineHeight: 22 },
  intensityCard:  { backgroundColor: colors.bg, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl },
  intensityLabel: { ...T.bodySmall, color: colors.textSecondary, marginBottom: spacing.md, textAlign: 'center' },
  intensityRow:   { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', marginBottom: spacing.xs },
  intensityBtn:   { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  intensityNum:   { ...T.bodyMedium, color: colors.textSecondary },
  intensityHint:  { ...T.caption, color: colors.textDim },
  sectionLabel:   { ...T.captionMedium, color: colors.textMuted, letterSpacing: 0.5, marginBottom: spacing.sm },
  techniques:     { gap: spacing.sm, marginBottom: spacing.xl },
  techniqueCard:  { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, gap: spacing.md },
  techniqueIcon:  { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.tealBg, alignItems: 'center', justifyContent: 'center' },
  techniqueTitle: { ...T.bodyMedium, color: colors.textPrimary, marginBottom: 2 },
  techniqueDesc:  { ...T.caption, color: colors.textMuted, lineHeight: 17 },
  durationBadge:  { backgroundColor: colors.surface, borderRadius: radius.sm, paddingVertical: 3, paddingHorizontal: spacing.sm },
  durationText:   { ...T.caption, color: colors.tealLight },
  logBtn:         { alignItems: 'center', paddingVertical: spacing.md, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, marginBottom: spacing.sm },
  logBtnText:     { ...T.bodySmall, color: colors.textMuted },
  closeBtn:       { alignItems: 'center', paddingVertical: spacing.lg },
  closeBtnText:   { ...T.bodySmall, color: colors.textDim },
})