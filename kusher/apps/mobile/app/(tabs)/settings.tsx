import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, ActivityIndicator, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import { useAuthStore } from '../../src/store/useAuthStore'
import { getProfile } from '../../src/services/api/profile'
import { getNotificationPreferences, updateNotificationPreferences } from '../../src/services/api/notifications'
import { updateQuitPlan } from '../../src/services/api/quitPlans'

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

  const [profile, setProfile] = useState<any>(null)
  const [notifPrefs, setNotifPrefs] = useState({
    morningReminder:      true,
    triggerWindowReminder: true,
    streakUpdates:        true,
    milestoneAlerts:      true,
    missedLogReminders:   true,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const [profileData, prefsData] = await Promise.all([
        getProfile(),
        getNotificationPreferences(),
      ])
      setProfile(profileData)
      setNotifPrefs({
        morningReminder:       prefsData.morningReminder      ?? true,
        triggerWindowReminder: prefsData.triggerWindowReminder ?? true,
        streakUpdates:         prefsData.streakUpdates         ?? true,
        milestoneAlerts:       prefsData.milestoneAlerts       ?? true,
        missedLogReminders:    prefsData.missedLogReminders    ?? true,
      })
    } catch (err) {
      console.error('Failed to load settings', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleNotif = async (key: keyof typeof notifPrefs) => {
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] }
    setNotifPrefs(updated)
    try {
      await updateNotificationPreferences({ [key]: updated[key] })
    } catch (err) {
      // revert on failure
      setNotifPrefs(notifPrefs)
    }
  }

  const handleSignOut = () => {
    const performSignOut = () => {
      clearAuth()
      router.replace('/(auth)/welcome')
    }

    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to sign out?')) {
        performSignOut()
      }
      return
    }

    Alert.alert('Sign out', 'Your progress is saved to your account.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: performSignOut },
    ])
  }

  const formatQuitDate = () => {
    if (!profile?.quitDate) return 'Not set'
    return new Date(profile.quitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleEditPackCost = () => {
    Alert.prompt(
      'Cost per pack',
      'Enter your pack cost in ₦',
      async (value) => {
        const num = parseFloat(value || '');
        if (isNaN(num)) return;
        try {
          await updateQuitPlan({ packPrice: num });
          setProfile((prev: any) => ({ ...prev, packCost: num }));
        } catch (err) {
          Alert.alert('Error', 'Failed to update pack cost');
        }
      },
      'plain-text',
      String(profile?.packCost ?? ''),
      'numeric'
    );
  };

  const handleEditCigsPerDay = () => {
    Alert.prompt(
      'Cigarettes per day',
      'How many cigarettes do you smoke per day?',
      async (value) => {
        const num = parseInt(value || '');
        if (isNaN(num)) return;
        try {
          await updateQuitPlan({ dailyCigarettes: num });
          setProfile((prev: any) => ({ ...prev, cigarettesPerDay: num }));
        } catch (err) {
          Alert.alert('Error', 'Failed to update cigarettes per day');
        }
      },
      'plain-text',
      String(profile?.cigarettesPerDay ?? ''),
      'numeric'
    );
  };
  

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.teal} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Settings</Text>

        <Pressable style={styles.profileCard} onPress={() => router.push('/profile')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(profile?.firstName ?? user?.firstName ?? 'U')[0].toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{profile?.firstName ?? user?.firstName ?? 'User'}</Text>
            <Text style={styles.profileEmail}>{profile?.email ?? user?.email ?? ''}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <Section title="Quit plan">
          <Row icon="📅" label="Quit date"         value={formatQuitDate()}              onPress={() => router.push('/profile')} />
          <Row icon="🚬" label="Cigarettes per day" value={`${profile?.cigarettesPerDay ?? 0}/day`} onPress={() => router.push('/profile')} />
          <Row icon="💰" label="Cost per pack"      value={`₦${profile?.packCost ?? 0}`}      onPress={() => router.push('/profile')} />
          <Row icon="🎯" label="Quit goal"          value={profile?.quitGoal?.replace('_', ' ') ?? 'Not set'} onPress={() => router.push('/profile')} />
        </Section>

        <Section title="Notifications">
          <Row icon="🌅" label="Morning reminder"    hint="Daily check-in at 9am"         toggle toggled={notifPrefs.morningReminder}       onPress={() => toggleNotif('morningReminder')} />
          <Row icon="⏰" label="Peak hour alerts"    hint="At your craving danger zones"   toggle toggled={notifPrefs.triggerWindowReminder} onPress={() => toggleNotif('triggerWindowReminder')} />
          <Row icon="🔥" label="Streak updates"      hint="Keep your streak going"         toggle toggled={notifPrefs.streakUpdates}         onPress={() => toggleNotif('streakUpdates')} />
          <Row icon="🏆" label="Milestone alerts"    hint="Celebrate every win"            toggle toggled={notifPrefs.milestoneAlerts}       onPress={() => toggleNotif('milestoneAlerts')} />
          <Row icon="📝" label="Log reminders"       hint="Remind you to log daily"        toggle toggled={notifPrefs.missedLogReminders}    onPress={() => toggleNotif('missedLogReminders')} />
        </Section>

        <Section title="App">
          <Row icon="🌙" label="Appearance"      value="Dark"  onPress={() => {}} />
          <Row icon="📊" label="Data & privacy"               onPress={() => {}} />
          <Row icon="📤" label="Export my data"               onPress={() => {}} />
        </Section>

        <Section title="Support">
          <Row icon="💬" label="Get help"        onPress={() => router.push('/(tabs)/support')} />
          <Row icon="⭐" label="Rate the app"    onPress={() => {}} />
          <Row icon="📋" label="Terms & Privacy" onPress={() => {}} />
          <Row icon="ℹ️" label="App version"     value="1.0.0" />
        </Section>

        <Section title="Account">
          <Row icon="🚪" label="Sign out"       destructive onPress={handleSignOut} />
          <Row icon="🗑️" label="Delete account" destructive onPress={() => {}} />
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