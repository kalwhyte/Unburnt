import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Button from '../../src/components/common/Button'
import { useRegister } from '../../src/hooks/useRegister'

export default function RegisterScreen() {
  const router = useRouter()
  const { register, loading, error } = useRegister()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const isValid = name.trim().length > 1 && email.includes('@') && password.length >= 8

  const strengthLevel = Math.min(Math.floor(password.length / 3), 4)
  const strengthLabel = password.length < 6 ? 'Weak' : password.length < 10 ? 'Fair' : 'Strong'

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={styles.heading}>Create account</Text>
          <Text style={styles.sub}>Join thousands who've quit smoking for good.</Text>

          <View style={styles.nudge}>
            <Text style={styles.nudgeText}>🔒 Your data is private. We never share it.</Text>
          </View>

          {error ? <View style={styles.errorBanner}><Text style={styles.errorText}>{error}</Text></View> : null}

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Your name</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Alex" placeholderTextColor={colors.textDim} autoCapitalize="words" />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={colors.textDim} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <Text style={styles.hint}>At least 8 characters</Text>
              <View>
                <TextInput style={[styles.input, { paddingRight: 64 }]} value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor={colors.textDim} secureTextEntry={!showPass} returnKeyType="done" onSubmitEditing={() => register({ name: name.trim(), email: email.trim(), password })} />
                <Pressable onPress={() => setShowPass(p => !p)} style={styles.eyeBtn}>
                  <Text style={styles.eyeText}>{showPass ? 'Hide' : 'Show'}</Text>
                </Pressable>
              </View>
              {password.length > 0 && (
                <View style={styles.strengthRow}>
                  {[...Array(4)].map((_, i) => (
                    <View key={i} style={[styles.strengthSeg, i < strengthLevel && styles.strengthActive]} />
                  ))}
                  <Text style={styles.strengthLabel}>{strengthLabel}</Text>
                </View>
              )}
            </View>
          </View>

          <Button title="Create account" onPress={() => register({ name: name.trim(), email: email.trim(), password })} loading={loading} disabled={!isValid} size="lg" style={{ marginBottom: spacing.lg }} />

          <Text style={styles.terms}>
            By creating an account you agree to our <Text style={styles.termsLink}>Terms</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
          <Pressable onPress={() => router.replace('/(auth)/login')} style={{ alignItems: 'center' }}>
            <Text style={styles.loginText}>Already have an account? <Text style={styles.loginAccent}>Sign in</Text></Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.bg },
  scroll:        { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xxl, flexGrow: 1 },
  backBtn:       { alignSelf: 'flex-start', paddingVertical: spacing.sm, marginBottom: spacing.xl },
  backText:      { ...T.body, color: colors.textMuted },
  heading:       { ...T.h1, color: colors.textPrimary, marginBottom: spacing.xs },
  sub:           { ...T.body, color: colors.textMuted, marginBottom: spacing.lg },
  nudge:         { backgroundColor: colors.tealBg, borderWidth: 0.5, borderColor: colors.tealDark, borderRadius: radius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.xl },
  nudgeText:     { ...T.bodySmall, color: colors.tealLight },
  errorBanner:   { backgroundColor: colors.dangerBg, borderWidth: 0.5, borderColor: colors.dangerBorder, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg },
  errorText:     { ...T.bodySmall, color: colors.danger },
  form:          { gap: spacing.lg, marginBottom: spacing.xl },
  field:         { gap: spacing.xs },
  label:         { ...T.captionMedium, color: colors.textSecondary, letterSpacing: 0.3 },
  hint:          { ...T.caption, color: colors.textMuted, marginTop: -2 },
  input:         { backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, ...T.body, color: colors.textPrimary },
  eyeBtn:        { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },
  eyeText:       { ...T.captionMedium, color: colors.tealLight },
  strengthRow:   { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  strengthSeg:   { flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.border },
  strengthActive:{ backgroundColor: colors.teal },
  strengthLabel: { ...T.caption, color: colors.textMuted, marginLeft: 4, minWidth: 36 },
  terms:         { ...T.caption, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 18 },
  termsLink:     { color: colors.tealLight },
  loginText:     { ...T.bodySmall, color: colors.textMuted },
  loginAccent:   { color: colors.tealLight, fontWeight: '500' },
})