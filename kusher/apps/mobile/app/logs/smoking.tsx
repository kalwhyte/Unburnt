

import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Button from '../../src/components/common/Button'
import { useLogSmoking } from '../../src/hooks/useLogSmoking'

const CONTEXTS = [
  { value: 'alone',   icon: '🧍', label: 'Alone' },
  { value: 'social',  icon: '👥', label: 'With others' },
  { value: 'work',    icon: '💼', label: 'Work break' },
  { value: 'driving', icon: '🚗', label: 'Driving' },
  { value: 'home',    icon: '🏠', label: 'At home' },
  { value: 'bar',     icon: '🍺', label: 'Bar/pub' },
]

const FEELINGS = [
  { value: 'stressed',  icon: '😤', label: 'Stressed' },
  { value: 'anxious',   icon: '😰', label: 'Anxious' },
  { value: 'bored',     icon: '😐', label: 'Bored' },
  { value: 'social',    icon: '😄', label: 'Social' },
  { value: 'habitual',  icon: '🔄', label: 'Habitual' },
  { value: 'relieved',  icon: '😮‍💨', label: 'Relief' },
]

export default function LogSmokingScreen() {
  const router = useRouter()
  const { log, loading } = useLogSmoking()

  const [count, setCount]     = useState(1)
  const [context, setContext] = useState('')
  const [feeling, setFeeling] = useState('')
  const [regret, setRegret]   = useState<boolean | null>(null)
  const [notes, setNotes]     = useState('')

  const handleSubmit = async () => {
    await log({ count, context, feeling, regret: regret ?? false, notes })
    router.back()
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.handle} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.smokeIcon}><Text style={{ fontSize: 28 }}>🚬</Text></View>
          <View>
            <Text style={styles.heading}>Log a Smoke</Text>
            <Text style={styles.sub}>No judgement. Data helps you improve.</Text>
          </View>
        </View>

        {/* Count */}
        <Text style={styles.label}>How many cigarettes?</Text>
        <View style={styles.counterRow}>
          <Pressable onPress={() => setCount(Math.max(1, count - 1))} style={styles.counterBtn}>
            <Text style={styles.counterBtnText}>−</Text>
          </Pressable>
          <Text style={styles.counterValue}>{count}</Text>
          <Pressable onPress={() => setCount(count + 1)} style={styles.counterBtn}>
            <Text style={styles.counterBtnText}>+</Text>
          </Pressable>
        </View>

        {/* Context */}
        <Text style={styles.label}>Where / what were you doing?</Text>
        <View style={styles.chipWrap}>
          {CONTEXTS.map((c) => (
            <Pressable
              key={c.value}
              onPress={() => setContext(c.value)}
              style={[styles.chip, context === c.value && styles.chipActive]}
            >
              <Text style={styles.chipIcon}>{c.icon}</Text>
              <Text style={[styles.chipText, context === c.value && styles.chipTextActive]}>{c.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Feeling */}
        <Text style={styles.label}>How were you feeling?</Text>
        <View style={styles.chipWrap}>
          {FEELINGS.map((f) => (
            <Pressable
              key={f.value}
              onPress={() => setFeeling(f.value)}
              style={[styles.chip, feeling === f.value && styles.chipActive]}
            >
              <Text style={styles.chipIcon}>{f.icon}</Text>
              <Text style={[styles.chipText, feeling === f.value && styles.chipTextActive]}>{f.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Regret */}
        <Text style={styles.label}>Do you regret it?</Text>
        <View style={styles.regretRow}>
          {[{ v: true, l: 'Yes, I regret it' }, { v: false, l: 'No, not right now' }].map((r) => (
            <Pressable
              key={String(r.v)}
              onPress={() => setRegret(r.v)}
              style={[styles.regretBtn, regret === r.v && styles.regretBtnActive]}
            >
              <Text style={[styles.regretText, regret === r.v && styles.regretTextActive]}>{r.l}</Text>
            </Pressable>
          ))}
        </View>

        {/* Notes */}
        <Text style={styles.label}>Notes <Text style={styles.optional}>(optional)</Text></Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="What could you do differently next time?"
          placeholderTextColor={colors.textDim}
          multiline
          numberOfLines={3}
        />

        <Button title="Save log" onPress={handleSubmit} loading={loading} size="lg" style={{ marginTop: spacing.xl }} />
        <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: colors.surface },
  handle:            { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginTop: spacing.sm, marginBottom: spacing.md },
  scroll:            { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  header:            { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  smokeIcon:         { width: 52, height: 52, borderRadius: radius.lg, backgroundColor: colors.dangerBg, borderWidth: 0.5, borderColor: colors.dangerBorder, alignItems: 'center', justifyContent: 'center' },
  heading:           { ...T.h2, color: colors.textPrimary },
  sub:               { ...T.caption, color: colors.textMuted, marginTop: 2 },
  label:             { ...T.captionMedium, color: colors.textSecondary, letterSpacing: 0.4, marginBottom: spacing.sm },
  counterRow:        { flexDirection: 'row', alignItems: 'center', gap: spacing.xl, marginBottom: spacing.xl, alignSelf: 'center' },
  counterBtn:        { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  counterBtnText:    { fontSize: 22, color: colors.textSecondary, lineHeight: 26 },
  counterValue:      { ...T.h1, color: colors.textPrimary, fontSize: 40, minWidth: 48, textAlign: 'center' },
  chipWrap:          { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  chip:              { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, backgroundColor: colors.bg, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.full },
  chipActive:        { backgroundColor: colors.tealBg, borderColor: colors.teal },
  chipIcon:          { fontSize: 14 },
  chipText:          { ...T.caption, color: colors.textMuted },
  chipTextActive:    { color: colors.tealLight },
  regretRow:         { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  regretBtn:         { flex: 1, paddingVertical: spacing.md, backgroundColor: colors.bg, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, alignItems: 'center' },
  regretBtnActive:   { backgroundColor: colors.tealBg, borderColor: colors.teal },
  regretText:        { ...T.bodySmall, color: colors.textMuted },
  regretTextActive:  { color: colors.tealLight },
  notesInput:        { backgroundColor: colors.bg, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, ...T.body, color: colors.textPrimary, minHeight: 180, textAlignVertical: 'top' },
  optional:          { fontWeight: '400', color: colors.textDim },
  cancelBtn:         { alignItems: 'center', paddingVertical: spacing.lg },
  cancelText:        { ...T.bodySmall, color: colors.textDim },
})