import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import { useRouter, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import { useAuthStore } from '../../src/store/useAuthStore'
import { getProfile } from '../../src/services/api/profile'

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Text style={{ fontSize: 16 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  )
}

export default function ProfileScreen() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchProfile() }, [])

  const fetchProfile = async () => {
    try {
      const data = await getProfile()
      setProfile(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatQuitDate = () => {
    if (!profile?.quitDate) return 'Not set'
    return new Date(profile.quitDate).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    })
  }

  const daysSinceQuit = () => {
    if (!profile?.quitDate) return 0
    return Math.floor((Date.now() - new Date(profile.quitDate).getTime()) / 86400000)
  }

  const moneySaved = () => {
    if (!profile?.packCost || !profile?.cigarettesPerDay) return '₦0'
    const costPerCig = Number(profile.packCost) / (profile.cigarettesPerPack ?? 2)
    const saved = costPerCig * profile.cigarettesPerDay * daysSinceQuit()
    return `₦${Math.round(saved).toLocaleString()}`
  }

  const cigsAvoided = () => {
    if (!profile?.cigarettesPerDay) return '0'
    return String(profile.cigarettesPerDay * daysSinceQuit())
  }

  if (loading) return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.teal} size="large" />
      </View>
    </SafeAreaView>
  )

  const initials = (user?.firstName ?? 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/dashboard')} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/profile/edit')} style={styles.editBtn}>
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>
          <Text style={styles.firstName}>{user?.firstName ?? 'User'}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>

          {profile?.quitDate && (
            <View style={styles.quitBadge}>
              <Text style={styles.quitBadgeText}>
                🚭 Quit {daysSinceQuit()} days ago
              </Text>
            </View>
          )}
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatPill value={cigsAvoided()} label="not smoked" />
          <View style={styles.statDivider} />
          <StatPill value={moneySaved()} label="saved" />
          <View style={styles.statDivider} />
          <StatPill value={`${daysSinceQuit()}d`} label="streak" />
        </View>

        {/* Smoking profile */}
        <Section title="Smoking profile">
          <InfoRow
            icon="🚬"
            label="Cigarettes per day"
            value={profile?.cigarettesPerDay ? `${profile.cigarettesPerDay} cigarettes` : 'Not set'}
          />
          <InfoRow
            icon="📦"
            label="Pack size"
            value={profile?.cigarettesPerPack ? `${profile.cigarettesPerPack} per pack` : '20 per pack'}
          />
          <InfoRow
            icon="💰"
            label="Cost per pack"
            value={profile?.packCost ? `₦${Number(profile.packCost).toLocaleString()}` : 'Not set'}
          />
          <InfoRow
            icon="📅"
            label="Years smoking"
            value={profile?.yearsSmoking ? `${profile.yearsSmoking} years` : 'Not set'}
          />
        </Section>

        {/* Quit plan */}
        <Section title="Quit plan">
          <InfoRow
            icon="🎯"
            label="Quit date"
            value={formatQuitDate()}
          />
          <InfoRow
            icon="🏆"
            label="Quit goal"
            value={profile?.quitGoal?.replace(/_/g, ' ') ?? 'Not set'}
          />
          {profile?.bio ? (
            <InfoRow icon="📝" label="Bio" value={profile.bio} />
          ) : null}
        </Section>

        {/* Edit CTA */}
        <Pressable style={styles.editCta} onPress={() => router.push('/profile/edit')}>
          <Text style={styles.editCtaText}>✏️  Edit profile</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.bg },
  scroll:        { paddingBottom: spacing.xxl },

  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  backBtn:       { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  backText:      { ...T.h3, color: colors.teal, lineHeight: 20 },
  editBtn:       { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, backgroundColor: colors.tealBg, borderWidth: 0.5, borderColor: colors.tealDark },
  editText:      { ...T.captionMedium, color: colors.tealLight },

  hero:          { alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.lg },
  avatarRing:    { width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: colors.teal, padding: 3, marginBottom: spacing.md },
  avatar:        { flex: 1, borderRadius: 44, backgroundColor: colors.tealBg, alignItems: 'center', justifyContent: 'center' },
  avatarText:    { fontSize: 32, fontWeight: '700', color: colors.tealLight },
  firstName:          { ...T.h2, color: colors.textPrimary, marginBottom: 4 },
  email:         { ...T.caption, color: colors.textMuted, marginBottom: spacing.md },
  quitBadge:     { backgroundColor: colors.tealBg, borderWidth: 0.5, borderColor: colors.tealDark, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  quitBadgeText: { ...T.captionMedium, color: colors.tealLight },

  statsRow:      { flexDirection: 'row', marginHorizontal: spacing.lg, backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.lg, paddingVertical: spacing.lg, marginBottom: spacing.xl },
  statPill:      { flex: 1, alignItems: 'center' },
  statValue:     { ...T.h2, color: colors.teal, marginBottom: 2 },
  statLabel:     { ...T.caption, color: colors.textMuted },
  statDivider:   { width: 0.5, backgroundColor: colors.border, marginVertical: spacing.xs },

  section:       { marginHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionTitle:  { ...T.captionMedium, color: colors.textMuted, letterSpacing: 0.5, marginBottom: spacing.sm, paddingLeft: spacing.xs },
  sectionCard:   { backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden' },

  infoRow:       { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: 0.5, borderBottomColor: colors.borderSoft },
  infoIconWrap:  { width: 32, height: 32, borderRadius: radius.sm, backgroundColor: colors.tealBg, alignItems: 'center', justifyContent: 'center' },
  infoLabel:     { ...T.caption, color: colors.textMuted, marginBottom: 2 },
  infoValue:     { ...T.bodySmall, color: colors.textPrimary, fontWeight: '500' },

  editCta:       { marginHorizontal: spacing.lg, marginTop: spacing.sm, paddingVertical: spacing.md, borderRadius: radius.lg, borderWidth: 0.5, borderColor: colors.border, alignItems: 'center', backgroundColor: colors.surface },
  editCtaText:   { ...T.bodySmall, color: colors.textMuted },
})
