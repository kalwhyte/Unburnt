import React, { useRef, useEffect } from 'react'
import { View, Text, StyleSheet, Animated, Platform} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Button from '../../src/components/common/Button'

const COMMITMENTS = [
  { icon: '🧠', text: 'You know your triggers now' },
  { icon: '💪', text: 'You\'ve already beaten cravings before' },
  { icon: '📊', text: 'Your data will help you this time' },
  { icon: '🆘', text: 'Craving rescue is always one tap away' },
]

const useNative = Platform.OS !== 'web'

export default function RestartScreen() {
  const router    = useRouter()
  const fadeAnim  = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: useNative }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: useNative }),
    ]).start()
  }, [])

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        <View style={styles.iconWrap}>
          <Text style={{ fontSize: 40 }}>🌱</Text>
        </View>

        <Text style={styles.heading}>New streak starts now</Text>
        <Text style={styles.sub}>
          Every moment you're not smoking is a victory. Your body starts healing within 20 minutes.
        </Text>

        <View style={styles.list}>
          {COMMITMENTS.map((c) => (
            <View key={c.text} style={styles.listItem}>
              <Text style={styles.listIcon}>{c.icon}</Text>
              <Text style={styles.listText}>{c.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>"Fall seven times, stand up eight."</Text>
          <Text style={styles.quoteAuthor}>— Japanese proverb</Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Restart my streak"
            onPress={() => router.replace('/(tabs)/dashboard')}
            size="lg"
          />
          <Button
            title="Update my quit plan"
            onPress={() => router.push('/(onboarding)/quit-plan')}
            variant="secondary"
            size="lg"
          />
        </View>

      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.bg },
  container:   { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  iconWrap:    { width: 88, height: 88, borderRadius: radius.xl, backgroundColor: colors.tealBg, borderWidth: 1, borderColor: colors.tealDark, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  heading:     { ...T.h1, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm, fontSize: 26 },
  sub:         { ...T.body, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  list:        { gap: spacing.sm, width: '100%', marginBottom: spacing.xl },
  listItem:    { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  listIcon:    { fontSize: 20 },
  listText:    { ...T.bodySmall, color: colors.textSecondary },
  quoteCard:   { backgroundColor: colors.tealBg, borderWidth: 0.5, borderColor: colors.tealDark, borderRadius: radius.lg, padding: spacing.lg, width: '100%', alignItems: 'center', marginBottom: spacing.xl },
  quoteText:   { ...T.body, color: colors.tealLight, fontStyle: 'italic', textAlign: 'center', marginBottom: spacing.xs },
  quoteAuthor: { ...T.caption, color: colors.teal },
  actions:     { gap: spacing.sm, width: '100%' },
})