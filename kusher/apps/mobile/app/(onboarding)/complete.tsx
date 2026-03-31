// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
// import { useRouter } from 'expo-router'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { useOnboardingStore } from '../../src/store/onboardingStore'
// import { colors, T } from '../../src/constants/theme'

// export default function OnboardingCompleteScreen() {
//   const router = useRouter()
//   const complete = useOnboardingStore((s) => s.complete)

//   const handleFinish = () => {
//     complete()
//     router.replace('/(tabs)')
//   }

//   return (
//     <SafeAreaView style={s.container}>
//       <View style={s.body}>
//         <View style={s.successIcon}>
//           <Text style={s.iconText}>🎉</Text>
//         </View>
//         <Text style={s.title}>You're all set!</Text>
//         <Text style={s.sub}>
//           Your personalized quit plan is ready. We're with you every step of the way on this journey to a smoke-free life.
//         </Text>

//         <View style={s.summaryCard}>
//           <Text style={s.summaryTitle}>Your Commitment</Text>
//           <View style={s.divider} />
//           <Text style={s.summaryText}>• Reclaiming your health</Text>
//           <Text style={s.summaryText}>• Saving for what matters</Text>
//           <Text style={s.summaryText}>• Breathing easier every day</Text>
//         </View>
//       </View>

//       <View style={s.footer}>
//         <TouchableOpacity style={s.btnPrimary} onPress={handleFinish}>
//           <Text style={s.btnPrimaryText}>Go to Dashboard</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   )
// }

// const s = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.bg },
//   body: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
//   successIcon: {
//     width: 80,
//     height: 80,
//     backgroundColor: colors.tealBg,
//     borderRadius: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   iconText: { fontSize: 36 },
//   title: { ...T.h1, color: colors.textPrimary, marginBottom: 8 },
//   sub: { ...T.body, color: colors.textMuted, textAlign: 'center', marginBottom: 24 },
//   summaryCard: { width: '100%', backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 32 },
//   summaryTitle: { ...T.bodyMedium, color: colors.textPrimary, marginBottom: 8 },
//   divider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
//   summaryText: { ...T.body, color: colors.textMuted, marginBottom: 4 },
//   footer: { paddingHorizontal: 24, paddingBottom: 24 },
//   btnPrimary: { backgroundColor: colors.teal, borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center' },
//   btnPrimaryText: { ...T.bodyMedium, color: colors.textPrimary },
// })

import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Button from '../../src/components/common/Button'
import { useOnboardingStore } from '../../src/store/onboardingStore'

const COMMITMENTS = [
  '✓ Your triggers are mapped',
  '✓ Your reasons are saved',
  '✓ Your quit plan is set',
  '✓ Craving rescue is ready',
]

export default function OnboardingCompleteScreen() {
  const router  = useRouter()
  const complete = useOnboardingStore((s) => s.complete)
  const fadeAnim  = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start()
  }, [])

  const handleStart = async () => {
    complete()
    router.replace('/(tabs)/dashboard')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.iconWrap}>
            <Text style={styles.iconEmoji}>🎉</Text>
          </View>

          <Text style={styles.heading}>You're all set!</Text>
          <Text style={styles.sub}>
            Your personalised quit plan is ready. The journey starts now — and we're with you every step.
          </Text>

          <View style={styles.commitmentList}>
            {COMMITMENTS.map((c) => (
              <View key={c} style={styles.commitmentItem}>
                <Text style={styles.commitmentText}>{c}</Text>
              </View>
            ))}
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statHeading}>Your first milestone</Text>
            <Text style={styles.statValue}>20 minutes</Text>
            <Text style={styles.statDesc}>After your last cigarette, your heart rate and blood pressure will already start to normalise.</Text>
          </View>
        </Animated.View>

        <Button title="Start my quit journey" onPress={handleStart} size="lg" />
        <Text style={styles.footNote}>You can update your plan anytime in Settings.</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: colors.bg },
  container:        { flex: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, justifyContent: 'space-between' },
  content:          { flex: 1, justifyContent: 'center' },
  iconWrap:         { width: 80, height: 80, borderRadius: radius.xl, backgroundColor: colors.tealBg, borderWidth: 1, borderColor: colors.tealDark, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: spacing.xl },
  iconEmoji:        { fontSize: 38 },
  heading:          { ...T.h1, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm, fontSize: 28 },
  sub:              { ...T.body, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  commitmentList:   { gap: spacing.sm, marginBottom: spacing.xl },
  commitmentItem:   { backgroundColor: colors.tealBg, borderWidth: 0.5, borderColor: colors.tealDark, borderRadius: radius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  commitmentText:   { ...T.bodySmall, color: colors.tealLight },
  statCard:         { backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl },
  statHeading:      { ...T.captionMedium, color: colors.textMuted, letterSpacing: 0.4, marginBottom: spacing.xs },
  statValue:        { ...T.h2, color: colors.tealLight, marginBottom: spacing.xs },
  statDesc:         { ...T.bodySmall, color: colors.textMuted, lineHeight: 20 },
  footNote:         { ...T.caption, color: colors.textDim, textAlign: 'center', marginTop: spacing.md },
})