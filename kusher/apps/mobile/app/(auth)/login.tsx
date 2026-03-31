// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
// import { useState } from "react";
// import { useLogin } from "../../src/hooks/useLogin";
// import { colors, T } from "../../src/constants/theme";

// export default function LoginScreen() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { handleLogin, loading, error } = useLogin();

//   return (
//     <View style={s.container}>
//       <Text style={s.title}>Login</Text>

//       <TextInput
//         placeholder="Email"
//         style={s.input}
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//         keyboardType="email-address"
//       />

//       <TextInput
//         placeholder="Password"
//         secureTextEntry
//         style={s.input}
//         value={password}
//         onChangeText={setPassword}
//       />

//       {error ? (
//         <Text style={s.errorText}>{error}</Text>
//       ) : null}

//       <TouchableOpacity
//         style={s.button}
//         onPress={() => handleLogin(email, password)}
//         disabled={loading}
//       >
//         <Text style={s.buttonText}>
//           {loading ? "Loading..." : "Login"}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, backgroundColor: colors.bg },
//   title: { ...T.h1, color: colors.textPrimary, marginBottom: 24 },
//   input: { borderWidth: 1, borderColor: colors.border, padding: 16, borderRadius: 12, marginBottom: 16, color: colors.textPrimary, ...T.body },
//   errorText: { color: colors.danger, marginBottom: 16, ...T.bodySmall },
//   button: { backgroundColor: colors.teal, padding: 16, borderRadius: 12, alignItems: 'center' },
//   buttonText: { color: colors.textPrimary, ...T.bodyMedium },
// });

import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Button from '../../src/components/common/Button'
import { useLogin } from '../../src/hooks/useLogin'

export default function LoginScreen() {
  const router = useRouter()
  const { login, loading, error } = useLogin()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.sub}>Sign in to continue your quit journey</Text>

          {error ? (
            <View style={styles.errorBanner}><Text style={styles.errorText}>{error}</Text></View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={colors.textDim} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            </View>
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
                  <Text style={styles.forgotText}>Forgot?</Text>
                </Pressable>
              </View>
              <View>
                <TextInput style={[styles.input, { paddingRight: 64 }]} value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor={colors.textDim} secureTextEntry={!showPass} returnKeyType="done" onSubmitEditing={() => login({ email: email.trim(), password })} />
                <Pressable onPress={() => setShowPass(p => !p)} style={styles.eyeBtn}>
                  <Text style={styles.eyeText}>{showPass ? 'Hide' : 'Show'}</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <Button title="Sign in" onPress={() => login({ email: email.trim(), password })} loading={loading} disabled={!email || !password} size="lg" style={{ marginBottom: spacing.xl }} />

          <View style={styles.divider}>
            <View style={styles.dividerLine} /><Text style={styles.dividerText}>or</Text><View style={styles.dividerLine} />
          </View>

          <Pressable onPress={() => router.replace('/(auth)/register')} style={{ alignItems: 'center' }}>
            <Text style={styles.loginText}>Don't have an account? <Text style={styles.loginAccent}>Create one</Text></Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.bg },
  scroll:      { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xxl, flexGrow: 1 },
  backBtn:     { alignSelf: 'flex-start', paddingVertical: spacing.sm, marginBottom: spacing.xl },
  backText:    { ...T.body, color: colors.textMuted },
  heading:     { ...T.h1, color: colors.textPrimary, marginBottom: spacing.xs },
  sub:         { ...T.body, color: colors.textMuted, marginBottom: spacing.xxl },
  errorBanner: { backgroundColor: colors.dangerBg, borderWidth: 0.5, borderColor: colors.dangerBorder, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg },
  errorText:   { ...T.bodySmall, color: colors.danger },
  form:        { gap: spacing.lg, marginBottom: spacing.xl },
  field:       { gap: spacing.xs },
  label:       { ...T.captionMedium, color: colors.textSecondary, letterSpacing: 0.3 },
  labelRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgotText:  { ...T.captionMedium, color: colors.tealLight },
  input:       { backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, ...T.body, color: colors.textPrimary },
  eyeBtn:      { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },
  eyeText:     { ...T.captionMedium, color: colors.tealLight },
  divider:     { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: colors.border },
  dividerText: { ...T.caption, color: colors.textMuted },
  loginText:   { ...T.bodySmall, color: colors.textMuted },
  loginAccent: { color: colors.tealLight, fontWeight: '500' },
})