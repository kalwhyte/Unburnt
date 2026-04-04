
import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Button from '../../src/components/common/Button'
import { useCraving } from '../../src/hooks/useCraving'

const TRIGGERS = [
  { value: 'stress',    icon: '😤', label: 'Stress' },
  { value: 'boredom',   icon: '😐', label: 'Boredom' },
  { value: 'alcohol',   icon: '🍺', label: 'Alcohol' },
  { value: 'coffee',    icon: '☕', label: 'Coffee' },
  { value: 'aftermeal', icon: '🍽️', label: 'After meal' },
  { value: 'social',    icon: '👥', label: 'Social' },
  { value: 'habit',     icon: '🔄', label: 'Habit' },
  { value: 'other',     icon: '❓', label: 'Other' },
]

const MOODS = [
  { value: 1, emoji: '😞', label: 'Very low' },
  { value: 2, emoji: '😕', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Great' },
]

const OUTCOMES = [
  { value: 'resisted',  label: '💪 Resisted' },
  { value: 'smoked',    label: '🚬 Smoked' },
  { value: 'uncertain', label: '🤷 Not sure yet' },
]

export default function LogCravingScreen() {
  const router = useRouter()
  const { logCraving, loading } = useCraving()

  const [intensity, setIntensity] = useState(3)
  const [trigger, setTrigger]     = useState('')
  const [mood, setMood]           = useState(3)
  const [outcome, setOutcome]     = useState('resisted')
  const [notes, setNotes]         = useState('')

  const handleSubmit = async () => {
    await logCraving({ intensity, trigger, mood: String(mood), resisted: outcome === 'resisted', notes })
    router.back()
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.handle} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.heading}>Log a craving</Text>
        <Text style={styles.sub}>Takes 30 seconds — helps us spot your patterns.</Text>

        {/* Intensity */}
        <Text style={styles.label}>Craving intensity</Text>
        <View style={styles.intensityRow}>
          {[1,2,3,4,5].map((n) => (
            <Pressable
              key={n}
              onPress={() => setIntensity(n)}
              style={[styles.intensityBtn, intensity === n && styles.intensityBtnActive]}
            >
              <Text style={[styles.intensityNum, intensity === n && styles.intensityNumActive]}>{n}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xl }}>
          <Text style={styles.hint}>Mild</Text>
          <Text style={styles.hint}>Intense</Text>
        </View>

        {/* Trigger */}
        <Text style={styles.label}>What triggered it?</Text>
        <View style={styles.chipWrap}>
          {TRIGGERS.map((t) => (
            <Pressable
              key={t.value}
              onPress={() => setTrigger(t.value)}
              style={[styles.chip, trigger === t.value && styles.chipActive]}
            >
              <Text style={styles.chipIcon}>{t.icon}</Text>
              <Text style={[styles.chipText, trigger === t.value && styles.chipTextActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Mood */}
        <Text style={styles.label}>How are you feeling?</Text>
        <View style={styles.moodRow}>
          {MOODS.map((m) => (
            <Pressable
              key={m.value}
              onPress={() => setMood(m.value)}
              style={[styles.moodBtn, mood === m.value && styles.moodBtnActive]}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={[styles.moodLabel, mood === m.value && styles.moodLabelActive]}>{m.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Outcome */}
        <Text style={styles.label}>What happened?</Text>
        <View style={styles.outcomeList}>
          {OUTCOMES.map((o) => (
            <Pressable
              key={o.value}
              onPress={() => setOutcome(o.value)}
              style={[styles.outcomeBtn, outcome === o.value && styles.outcomeBtnActive]}
            >
              <Text style={[styles.outcomeText, outcome === o.value && styles.outcomeTextActive]}>{o.label}</Text>
              <View style={[styles.radio, outcome === o.value && styles.radioActive]} />
            </Pressable>
          ))}
        </View>

        {/* Notes */}
        <Text style={styles.label}>Notes <Text style={styles.optional}>(optional)</Text></Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Anything else worth noting?"
          placeholderTextColor={colors.textDim}
          multiline
          numberOfLines={3}
        />

        <Button title="Save craving log" onPress={handleSubmit} loading={loading} size="lg" style={{ marginTop: spacing.xl }} />
        <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:               { flex: 1, backgroundColor: colors.surface },
  handle:             { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginTop: spacing.sm, marginBottom: spacing.md },
  scroll:             { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  heading:            { ...T.h1, color: colors.textPrimary, marginBottom: spacing.xs },
  sub:                { ...T.body, color: colors.textMuted, marginBottom: spacing.xl },
  label:              { ...T.captionMedium, color: colors.textSecondary, letterSpacing: 0.4, marginBottom: spacing.sm },
  hint:               { ...T.caption, color: colors.textDim },
  intensityRow:       { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs },
  intensityBtn:       { flex: 1, height: 48, backgroundColor: colors.bg, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  intensityBtnActive: { backgroundColor: colors.dangerBg, borderColor: colors.danger },
  intensityNum:       { ...T.bodyMedium, color: colors.textMuted },
  intensityNumActive: { color: colors.danger },
  chipWrap:           { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  chip:               { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, backgroundColor: colors.bg, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.full },
  chipActive:         { backgroundColor: colors.tealBg, borderColor: colors.teal },
  chipIcon:           { fontSize: 14 },
  chipText:           { ...T.caption, color: colors.textMuted },
  chipTextActive:     { color: colors.tealLight },
  moodRow:            { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  moodBtn:            { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, backgroundColor: colors.bg, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, gap: 3 },
  moodBtnActive:      { backgroundColor: colors.tealBg, borderColor: colors.teal },
  moodEmoji:          { fontSize: 20 },
  moodLabel:          { fontSize: 9, color: colors.textDim, textAlign: 'center' },
  moodLabelActive:    { color: colors.tealLight },
  outcomeList:        { gap: spacing.sm, marginBottom: spacing.xl },
  outcomeBtn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.bg, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  outcomeBtnActive:   { backgroundColor: colors.tealBg, borderColor: colors.teal },
  outcomeText:        { ...T.body, color: colors.textMuted },
  outcomeTextActive:  { color: colors.tealLight },
  radio:              { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: colors.border },
  radioActive:        { borderColor: colors.teal, backgroundColor: colors.teal },
  notesInput:         { backgroundColor: colors.bg, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, ...T.body, color: colors.textPrimary, minHeight: 80, textAlignVertical: 'top' },
  optional:           { fontWeight: '400', color: colors.textDim },
  cancelBtn:          { alignItems: 'center', paddingVertical: spacing.lg },
  cancelText:         { ...T.bodySmall, color: colors.textDim },
})