import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import { getProfile, updateProfile } from '../../src/services/api/profile'
import { updateQuitPlan } from '../../src/services/api/quitPlans'
import Button from '../../src/components/common/Button'

function Field({ label, value, onChangeText, keyboardType, placeholder }: {
  label: string
  value: string
  onChangeText: (v: string) => void
  keyboardType?: any
  placeholder?: string
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? 'default'}
        placeholder={placeholder}
        placeholderTextColor={colors.textDim}
      />
    </View>
  )
}

export default function EditProfileScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    cigarettesPerDay: '',
    packCost:         '',
    yearsSmoking:     '',
    quitDate:         '',
    bio:              '',
  })

  useEffect(() => {
    getProfile().then((p) => {
      setForm({
        cigarettesPerDay: String(p.cigarettesPerDay ?? ''),
        packCost:         String(p.packCost ?? ''),
        yearsSmoking:     String(p.yearsSmoking ?? ''),
        quitDate:         p.quitDate ? p.quitDate.slice(0, 10) : '',
        bio:              p.bio ?? '',
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    try {
      setSaving(true)
      await Promise.all([
        updateProfile({
          displayName: form.bio || undefined, // Mapping bio to displayName or update API if needed
        }),
        updateQuitPlan({
          dailyCigarettes: form.cigarettesPerDay ? parseInt(form.cigarettesPerDay) : undefined,
          packPrice: form.packCost ? parseFloat(form.packCost) : undefined,
          startDate: form.quitDate || undefined,
        })
      ])
      router.back()
    } catch (err) {
      Alert.alert('Failed to save', 'Please try again.')
    } finally {
      setSaving(false)
    }
  }

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
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Field label="Cigarettes per day"  value={form.cigarettesPerDay} onChangeText={set('cigarettesPerDay')} keyboardType="numeric"        placeholder="e.g. 10" />
        <Field label="Pack cost (₦)"       value={form.packCost}         onChangeText={set('packCost')}         keyboardType="numeric"        placeholder="e.g. 1500" />
        <Field label="Years smoking"       value={form.yearsSmoking}     onChangeText={set('yearsSmoking')}     keyboardType="numeric"        placeholder="e.g. 5" />
        <Field label="Quit date (YYYY-MM-DD)" value={form.quitDate}     onChangeText={set('quitDate')}         keyboardType="default"        placeholder="e.g. 2025-01-01" />
        <Field label="Bio (optional)"      value={form.bio}              onChangeText={set('bio')}              placeholder="A little about yourself..." />

        <Button title="Save changes" onPress={handleSave} loading={saving} size="lg" style={{ marginTop: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.bg },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  back:        { ...T.body, color: colors.teal, width: 60 },
  title:       { ...T.h3, color: colors.textPrimary },
  scroll:      { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xxl },
  field:       { marginBottom: spacing.lg },
  fieldLabel:  { ...T.captionMedium, color: colors.textMuted, letterSpacing: 0.4, marginBottom: spacing.xs },
  fieldInput:  { backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, ...T.body, color: colors.textPrimary },
})