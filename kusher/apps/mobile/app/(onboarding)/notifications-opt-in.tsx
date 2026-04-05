import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Button from '../../src/components/common/Button'

const BENEFITS = [
  { icon: '⏰', title: 'Craving alerts',       desc: "Nudge when you're most likely to reach for a cigarette." },
  { icon: '🏆', title: 'Milestone celebrations', desc: 'Cheer every hour, day, and week smoke-free.' },
  { icon: '💪', title: 'Daily motivation',       desc: 'Morning check-in to set your intention for the day.' },
  { icon: '🆘', title: 'SOS rescue',             desc: 'One tap from the notification goes straight to craving rescue.' },
]

export default function NotificationsOptInScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleEnable = async () => {
    setLoading(true)
    try {
      const { registerForPushNotificationsAsync } = await import('../../src/services/notifications/expoNotifications')
      await registerForPushNotificationsAsync()
    } catch (e) {
      console.warn('Push permission denied', e)
    } finally {
      setLoading(false)
      router.replace('/(onboarding)/complete')
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.iconWrap}><Text style={{ fontSize: 28 }}>🔔</Text></View>
        <Text style={styles.heading}>Stay on track</Text>
        <Text style={styles.sub}>
          People who enable notifications are <Text style={styles.accent}>3× more likely</Text> to succeed.
        </Text>

        <View style={styles.benefits}>
          {BENEFITS.map((b) => (
            <View key={b.title} style={styles.benefit}>
              <View style={styles.benefitIcon}><Text style={{ fontSize: 18 }}>{b.icon}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitDesc}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.privacy}>You can change this anytime in Settings. Max 3 notifications/day.</Text>

        <View style={styles.actions}>
          <Button title="Enable notifications" onPress={handleEnable} loading={loading} size="lg" />
          <Pressable onPress={() => router.replace('/(onboarding)/complete')} style={styles.skipBtn}>
            <Text style={styles.skipText}>Not now</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.bg },
  container:    { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.xl },
  iconWrap:     { width: 64, height: 64, borderRadius: radius.xl, backgroundColor: colors.tealBg, borderWidth: 1, borderColor: colors.tealDark, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg, alignSelf: 'center' },
  heading:      { ...T.h1, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  sub:          { ...T.body, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  accent:       { color: colors.tealLight, fontWeight: '500' },
  benefits:     { gap: spacing.md, marginBottom: spacing.xl, flex: 1 },
  benefit:      { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md },
  benefitIcon:  { width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.tealBg, alignItems: 'center', justifyContent: 'center' },
  benefitTitle: { ...T.bodyMedium, color: colors.textPrimary, marginBottom: 2 },
  benefitDesc:  { ...T.caption, color: colors.textMuted, lineHeight: 17 },
  privacy:      { ...T.caption, color: colors.textMuted, textAlign: 'center', lineHeight: 18, marginBottom: spacing.xl },
  actions:      { gap: spacing.sm },
  skipBtn:      { alignItems: 'center', paddingVertical: spacing.md },
  skipText:     { ...T.bodySmall, color: colors.textMuted },
})