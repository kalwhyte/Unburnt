import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import { useAuthStore } from '../../src/store/useAuthStore'

function Row({ icon, label, value, onPress, toggle, toggled, destructive, hint }: {
  icon: string; label: string; value?: string; onPress?: () => void
  toggle?: boolean; toggled?: boolean; destructive?: boolean; hint?: string
}) {
  return (
    <Pressable onPress={onPress} disabled={!onPress && !toggle}
      style={({ pressed }) => [styles.row, pressed && onPress && { backgroundColor: colors.surfaceAlt }]}>
      <View style={styles.rowIcon}><Text style={{ fontSize: 18 }}>{icon}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, destructive && { color: colors.danger }]}>{label}</Text>
        {hint ? <Text style={{ ...T.caption, color: colors.textMuted, marginTop: 1 }}>{hint}</Text> : null}
      </View>
      {toggle
        ? <Switch value={toggled} onValueChange={onPress as any} trackColor={{ false: colors.border, true: colors.tealDark }} thumbColor={toggled ? colors.teal : colors.textDim} />
        : value
          ? <Text style={{ ...T.caption, color: colors.textMuted }}>{value}</Text>
          : onPress ? <Text style={styles.chevron}>›</Text> : null
      }
    </Pressable>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: spacing.xl }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  )
}

export default function SettingsScreen() {
  const router = useRouter()
  const { user, clearAuth } = useAuthStore()
  const [notifDaily,     setNotifDaily]     = useState(true)
  const [notifCraving,   setNotifCraving]   = useState(true)
  const [notifMilestone, setNotifMilestone] = useState(true)
  const [haptics,        setHaptics]        = useState(true)

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Your progress is saved to your account.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => { clearAuth(); router.replace('/(auth)/welcome') } },
    ])
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Settings</Text>

        <Pressable style={styles.profileCard} onPress={() => {}}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user?.name ?? 'U')[0].toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{user?.name ?? 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email ?? ''}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <Section title="Quit plan">
          <Row icon="📅" label="Quit date"          value="Jan 1, 2025" onPress={() => {}} />
          <Row icon="🎯" label="My reasons to quit"                     onPress={() => {}} />
          <Row icon="💰" label="Cost per pack"       value="$12.00"      onPress={() => {}} />
        </Section>

        <Section title="Notifications">
          <Row icon="🌅" label="Daily check-in"    hint="Morning motivation"      toggle toggled={notifDaily}     onPress={() => setNotifDaily(v => !v)} />
          <Row icon="🚨" label="Craving alerts"    hint="At peak craving times"   toggle toggled={notifCraving}   onPress={() => setNotifCraving(v => !v)} />
          <Row icon="🏆" label="Milestone alerts"  hint="Celebrate every win"     toggle toggled={notifMilestone} onPress={() => setNotifMilestone(v => !v)} />
        </Section>

        <Section title="App">
          <Row icon="📳" label="Haptic feedback" toggle toggled={haptics} onPress={() => setHaptics(v => !v)} />
          <Row icon="🌙" label="Appearance"      value="Dark"             onPress={() => {}} />
          <Row icon="📊" label="Data & privacy"                           onPress={() => {}} />
          <Row icon="📤" label="Export my data"                           onPress={() => {}} />
        </Section>

        <Section title="Support">
          <Row icon="💬" label="Get help"       onPress={() => router.push('/(tabs)/support')} />
          <Row icon="⭐" label="Rate the app"   onPress={() => {}} />
          <Row icon="📋" label="Terms & Privacy" onPress={() => {}} />
          <Row icon="ℹ️" label="App version"    value="1.0.0" />
        </Section>

        <Section title="Account">
          <Row icon="🚪" label="Sign out"        destructive onPress={handleSignOut} />
          <Row icon="🗑️" label="Delete account"  destructive onPress={() => {}} />
        </Section>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.bg },
  scroll:       { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: spacing.md },
  pageTitle:    { ...T.h1, color: colors.textPrimary, marginBottom: spacing.xl },
  profileCard:  { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl, gap: spacing.md },
  avatar:       { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.tealBg, borderWidth: 1, borderColor: colors.tealDark, alignItems: 'center', justifyContent: 'center' },
  avatarText:   { ...T.h3, color: colors.tealLight },
  profileName:  { ...T.bodyMedium, color: colors.textPrimary },
  profileEmail: { ...T.caption, color: colors.textMuted, marginTop: 2 },
  sectionTitle: { ...T.captionMedium, color: colors.textMuted, letterSpacing: 0.5, marginBottom: spacing.xs, paddingLeft: spacing.xs },
  sectionCard:  { backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden' },
  row:          { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.lg, gap: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.borderSoft },
  rowIcon:      { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  rowLabel:     { ...T.bodySmall, color: colors.textPrimary },
  chevron:      { ...T.h3, color: colors.textDim, lineHeight: 20 },
})