import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native'
import { useRouter, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import { useAuthStore } from '../../src/store/useAuthStore'
import { getProfile } from '../../src/services/api/profile'
import { updateQuitPlan } from '../../src/services/api/quitPlans'

const router = useRouter()

function ProfileRow({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.row} disabled={!onPress}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      {onPress && <Text style={styles.editBtn}>Edit</Text>}
    </Pressable>
  )
}

export default function ProfileScreen() {
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

  const handleEdit = (field: string, currentVal: any, updateFn: (val: any) => Promise<void>) => {
    Alert.prompt(`Edit ${field}`, `Enter new value`, async (val) => {
      if (!val) return
      try {
        await updateFn(val)
        fetchProfile()
      } catch (err) {
        Alert.alert('Error', 'Update failed')
      }
    }, 'plain-text', String(currentVal))
  }

  if (loading) return <View style={styles.centered}><ActivityIndicator color={colors.teal} /></View>

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ title: 'Profile', headerShadowVisible: false, headerStyle: { backgroundColor: colors.bg } }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(profile?.firstName ?? user?.firstName ?? 'U')[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{profile?.firstName} {profile?.lastName}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Info</Text>
          <ProfileRow label="First Name" value={profile?.firstName} />
          <ProfileRow label="Last Name" value={profile?.lastName} />
          <ProfileRow label="Email" value={profile?.email} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quit Plan</Text>
          
          <ProfileRow label="Cigarettes per day" value={`${profile?.cigarettesPerDay ?? 0}`} 
            onPress={() => router.push('/profile/edit')} />

          <ProfileRow label="Cost per pack" value={`₦${profile?.packCost ?? 0}`} 
            onPress={() => router.push('/profile/edit')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.tealBg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md, borderWidth: 1, borderColor: colors.tealDark },
  avatarText: { ...T.h1, color: colors.tealLight },
  name: { ...T.h2, color: colors.textPrimary },
  email: { ...T.bodySmall, color: colors.textMuted },
  section: { marginBottom: spacing.xl, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 0.5, borderColor: colors.border },
  sectionTitle: { ...T.captionMedium, color: colors.textMuted, marginBottom: spacing.md, textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.borderSoft },
  rowLabel: { ...T.caption, color: colors.textMuted },
  rowValue: { ...T.bodyMedium, color: colors.textPrimary, marginTop: 2 },
  editBtn: { ...T.bodySmall, color: colors.teal, fontWeight: '600' }
})
