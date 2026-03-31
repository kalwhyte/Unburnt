import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Button from '../../src/components/common/Button'

const REASONS = [
  { value: 'stress',   label: 'Overwhelming stress' },
  { value: 'social',   label: 'Social pressure' },
  { value: 'alcohol',  label: 'Drinking alcohol' },
  { value: 'trigger',  label: 'Unavoidable trigger' },
  { value: 'emotion',  label: 'Difficult emotions' },
  { value: 'habit',    label: 'Old habit kicked in' },
  { value: 'other',    label: 'Other' },
]

export default function RelapseReportScreen() {
  const router = useRouter()
  const [reason, setReason]   = useState('')
  const [notes, setNotes]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    router.replace('/relapse/restart')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.iconWrap}>
          <Text style={{ fontSize: 32 }}>💙</Text>
        </View>

        <Text style={styles.heading}>It's okay — relapses happen</Text>
        <Text style={styles.sub}>
          Most people quit 8–10 times before succeeding for good. This is part of the process, not the end.
        </Text>

        <View style={styles.compassionCard}>
          <Text style={styles.compassionText}>
            You're not starting over — you're starting again with more knowledge about what you're up against.
          </Text>
        </View>

        <Text style={styles.label}>What led to the slip?</Text>
        <View style={styles.optionList}>
          {REASONS.map((r) => (
            <Pressable
              key={r.value}
              onPress={() => setReason(r.value)}
              style={[styles.option, reason === r.value && styles.optionActive]}
            >
              <Text style={[styles.optionText, reason === r.value && styles.optionTextActive]}>{r.label}</Text>
              <View style={[styles.radio, reason === r.value && styles.radioActive]} />
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>What could you do differently? <Text style={styles.optional}>(optional)</Text></Text>
        <TextInput
          style={styles.input}
          value={notes}
          onChangeText={setNotes}
          placeholder="e.g. I'll call a friend next time I feel this way"
          placeholderTextColor={colors.textDim}
          multiline
          numberOfLines={4}
        />

        <Button
          title="Log this & start fresh"
          onPress={handleSubmit}
          loading={loading}
          disabled={!reason}
          size="lg"
          style={{ marginTop: spacing.xl }}
        />
        <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>I'll do this later</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: colors.bg },
  scroll:           { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, paddingTop: spacing.xl },
  iconWrap:         { width: 72, height: 72, borderRadius: radius.xl, backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#2a2a4e', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: spacing.lg },
  heading:          { ...T.h1, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  sub:              { ...T.body, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  compassionCard:   { backgroundColor: colors.surfaceAlt, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl },
  compassionText:   { ...T.body, color: colors.textSecondary, lineHeight: 22, fontStyle: 'italic', textAlign: 'center' },
  label:            { ...T.captionMedium, color: colors.textSecondary, letterSpacing: 0.4, marginBottom: spacing.sm },
  optionList:       { gap: spacing.sm, marginBottom: spacing.xl },
  option:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  optionActive:     { backgroundColor: colors.tealBg, borderColor: colors.teal },
  optionText:       { ...T.body, color: colors.textMuted },
  optionTextActive: { color: colors.tealLight },
  radio:            { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: colors.border },
  radioActive:      { borderColor: colors.teal, backgroundColor: colors.teal },
  input:            { backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, ...T.body, color: colors.textPrimary, minHeight: 96, textAlignVertical: 'top' },
  optional:         { fontWeight: '400', color: colors.textDim },
  cancelBtn:        { alignItems: 'center', paddingVertical: spacing.lg },
  cancelText:       { ...T.bodySmall, color: colors.textDim },
})