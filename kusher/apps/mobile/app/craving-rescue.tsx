
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