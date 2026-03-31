// import React, { useState, useEffect, useRef } from 'react'
// import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native'
// import { useRouter } from 'expo-router'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { colors, T } from '../../src/constants/theme'

// export default function BreathingScreen() {
//   const router = useRouter()
//   const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale')
//   const [counter, setCounter] = useState(4)
//   const scaleAnim = useRef(new Animated.Value(1)).current

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCounter((prev) => {
//         if (prev > 1) return prev - 1
        
//         // Switch phases
//         if (phase === 'Inhale') {
//           setPhase('Hold')
//           return 4
//         } else if (phase === 'Hold') {
//           setPhase('Exhale')
//           return 4
//         } else {
//           setPhase('Inhale')
//           return 4
//         }
//       })
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [phase])

//   useEffect(() => {
//     if (phase === 'Inhale') {
//       Animated.timing(scaleAnim, {
//         toValue: 1.5,
//         duration: 4000,
//         useNativeDriver: true,
//       }).start()
//     } else if (phase === 'Exhale') {
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 4000,
//         useNativeDriver: true,
//       }).start()
//     }
//   }, [phase])

//   return (
//     <SafeAreaView style={s.container}>
//       <View style={s.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Text style={s.closeText}>Cancel</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={s.content}>
//         <Text style={s.instruction}>{phase}</Text>
//         <Text style={s.counter}>{counter}</Text>
//         <Animated.View 
//           style={[
//             s.visualizer, 
//             { transform: [{ scale: scaleAnim }] }
//           ]}
//         />
//       </View>
//     </SafeAreaView>
//   )
// }

// const s = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.bg },
//   header: { padding: 16 },
//   closeText: { color: colors.teal, ...T.body },
//   content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   instruction: { ...T.h2, color: colors.textPrimary, marginBottom: 8 },
//   counter: { ...T.h1, color: colors.textPrimary, marginBottom: 24 },
//   visualizer: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     backgroundColor: colors.teal,
//     opacity: 0.7,
//   },
// })

import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale'

const PHASES: { phase: Phase; duration: number; label: string; instruction: string }[] = [
  { phase: 'inhale', duration: 4000, label: 'Inhale',  instruction: 'Breathe in slowly through your nose' },
  { phase: 'hold',   duration: 7000, label: 'Hold',    instruction: 'Hold your breath gently' },
  { phase: 'exhale', duration: 8000, label: 'Exhale',  instruction: 'Breathe out completely through your mouth' },
]

const TOTAL_CYCLES = 4

export default function BreathingScreen() {
  const router   = useRouter()
  const scaleAnim = useRef(new Animated.Value(1)).current
  const opacAnim  = useRef(new Animated.Value(0.4)).current

  const [running,       setRunning]       = useState(false)
  const [phaseIndex,    setPhaseIndex]    = useState(0)
  const [cycleCount,    setCycleCount]    = useState(0)
  const [countdown,     setCountdown]     = useState(0)
  const [done,          setDone]          = useState(false)

  const currentPhase = PHASES[phaseIndex % PHASES.length]
  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null)
  const animRef      = useRef<Animated.CompositeAnimation | null>(null)

  const startPhase = (index: number, cycle: number) => {
    const p = PHASES[index % PHASES.length]
    setPhaseIndex(index)
    setCountdown(Math.ceil(p.duration / 1000))

    animRef.current?.stop()
    if (p.phase === 'inhale') {
      animRef.current = Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 1.5, duration: p.duration, useNativeDriver: true }),
        Animated.timing(opacAnim,  { toValue: 1,   duration: p.duration, useNativeDriver: true }),
      ])
    } else if (p.phase === 'exhale') {
      animRef.current = Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 1,   duration: p.duration, useNativeDriver: true }),
        Animated.timing(opacAnim,  { toValue: 0.4, duration: p.duration, useNativeDriver: true }),
      ])
    } else {
      animRef.current = Animated.timing(scaleAnim, { toValue: 1.5, duration: p.duration, useNativeDriver: true })
    }
    animRef.current.start()

    let elapsed = 0
    timerRef.current = setInterval(() => {
      elapsed += 1000
      setCountdown(Math.ceil((p.duration - elapsed) / 1000))
      if (elapsed >= p.duration) {
        clearInterval(timerRef.current!)
        const nextIndex = index + 1
        const nextCycle = nextIndex % PHASES.length === 0 ? cycle + 1 : cycle
        if (nextCycle >= TOTAL_CYCLES && nextIndex % PHASES.length === 0) {
          setDone(true)
          setRunning(false)
        } else {
          setCycleCount(nextCycle)
          startPhase(nextIndex, nextCycle)
        }
      }
    }, 1000)
  }

  const handleStart = () => {
    setRunning(true)
    setDone(false)
    setCycleCount(0)
    startPhase(0, 0)
  }

  useEffect(() => () => {
    clearInterval(timerRef.current!)
    animRef.current?.stop()
  }, [])

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.heading}>4-7-8 Breathing</Text>
        <Text style={styles.sub}>4 cycles · ~2 minutes · activates your calm response</Text>

        <View style={styles.circleWrap}>
          <Animated.View style={[styles.circleOuter, { transform: [{ scale: scaleAnim }], opacity: opacAnim }]} />
          <View style={styles.circleInner}>
            {done ? (
              <Text style={styles.doneText}>✓</Text>
            ) : running ? (
              <>
                <Text style={styles.phaseLabel}>{currentPhase.label}</Text>
                <Text style={styles.countdown}>{countdown}</Text>
              </>
            ) : (
              <Text style={styles.tapText}>Tap to begin</Text>
            )}
          </View>
        </View>

        {running && !done && (
          <Text style={styles.instruction}>{currentPhase.instruction}</Text>
        )}

        {running && !done && (
          <Text style={styles.cycleText}>Cycle {cycleCount + 1} of {TOTAL_CYCLES}</Text>
        )}

        {done && (
          <View style={styles.doneCard}>
            <Text style={styles.doneHeading}>Well done 🎉</Text>
            <Text style={styles.doneDesc}>Your nervous system is calming. The craving should be easing now.</Text>
          </View>
        )}

        {!running && !done && (
          <Pressable style={styles.startBtn} onPress={handleStart}>
            <Text style={styles.startBtnText}>Start breathing exercise</Text>
          </Pressable>
        )}

        {(done || running) && (
          <View style={styles.actions}>
            {done && (
              <Pressable style={styles.primaryAction} onPress={() => router.push('/craving/result' as any)}>
                <Text style={styles.primaryActionText}>Continue →</Text>
              </Pressable>
            )}
            <Pressable style={styles.secondaryAction} onPress={() => router.back()}>
              <Text style={styles.secondaryActionText}>{done ? 'Back to rescue' : 'Stop'}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: colors.bg },
  container:         { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xl, alignItems: 'center' },
  backBtn:           { alignSelf: 'flex-start', paddingVertical: spacing.sm, marginBottom: spacing.xl },
  backText:          { ...T.body, color: colors.textMuted },
  heading:           { ...T.h2, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.xs },
  sub:               { ...T.bodySmall, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.xxl },
  circleWrap:        { width: 220, height: 220, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  circleOuter:       { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: colors.tealBg, borderWidth: 1, borderColor: colors.tealDark },
  circleInner:       { width: 110, height: 110, borderRadius: 55, backgroundColor: colors.tealDark, alignItems: 'center', justifyContent: 'center' },
  phaseLabel:        { ...T.captionMedium, color: colors.tealLight, letterSpacing: 0.5 },
  countdown:         { fontSize: 40, fontWeight: '700', color: colors.tealLight, lineHeight: 46 },
  tapText:           { ...T.bodySmall, color: colors.teal, textAlign: 'center' },
  doneText:          { fontSize: 36, color: colors.tealLight },
  instruction:       { ...T.body, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.md },
  cycleText:         { ...T.caption, color: colors.textDim },
  doneCard:          { backgroundColor: colors.tealBg, borderWidth: 0.5, borderColor: colors.tealDark, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.xl },
  doneHeading:       { ...T.h3, color: colors.tealLight, marginBottom: spacing.xs },
  doneDesc:          { ...T.bodySmall, color: colors.teal, textAlign: 'center', lineHeight: 20 },
  startBtn:          { backgroundColor: colors.teal, borderRadius: radius.md, paddingVertical: spacing.md, paddingHorizontal: spacing.xxl, marginTop: 'auto' },
  startBtnText:      { ...T.bodyMedium, color: '#fff' },
  actions:           { gap: spacing.sm, width: '100%', marginTop: 'auto' },
  primaryAction:     { backgroundColor: colors.teal, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  primaryActionText: { ...T.bodyMedium, color: '#fff' },
  secondaryAction:   { alignItems: 'center', paddingVertical: spacing.md },
  secondaryActionText:{ ...T.bodySmall, color: colors.textDim },
})