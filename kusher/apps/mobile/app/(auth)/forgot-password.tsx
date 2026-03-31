// import { useState } from 'react'
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
// import { useRouter } from 'expo-router'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { colors, T } from '../../src/constants/theme'

// export default function ForgotPasswordScreen() {
//   const router = useRouter()
//   const [email, setEmail] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [submitted, setSubmitted] = useState(false)

//   const handleReset = async () => {
//     if (!email) return
//     setLoading(true)
//     // Integration with API would go here
//     setTimeout(() => {
//       setLoading(false)
//       setSubmitted(true)
//     }, 1500)
//   }

//   return (
//     <SafeAreaView style={s.container}>
//       <KeyboardAvoidingView 
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//       >
//         <ScrollView contentContainerStyle={s.body}>
//           <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
//             <Text style={s.backText}>← Back to Login</Text>
//           </TouchableOpacity>

//           {!submitted ? (
//             <>
//               <Text style={s.title}>Reset Password</Text>
//               <Text style={s.sub}>Enter your email address and we'll send you instructions to reset your password.</Text>

//               <View style={s.inputGroup}>
//                 <Text style={s.label}>Email Address</Text>
//                 <TextInput
//                   value={email}
//                   onChangeText={setEmail}
//                   placeholder="name@example.com"
//                   style={s.input}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                 />
//               </View>

//               <TouchableOpacity 
//                 style={[s.btnPrimary, !email && s.btnDisabled]} 
//                 onPress={handleReset} 
//                 disabled={loading || !email}
//               >
//                 <Text style={s.btnPrimaryText}>{loading ? 'Sending...' : 'Send Instructions'}</Text>
//               </TouchableOpacity>
//             </>
//           ) : (
//             <View style={s.confirmation}>
//               <Text style={s.title}>Email Sent</Text>
//               <Text style={s.sub}>If an account with that email exists, you should receive instructions shortly.</Text>
//               <TouchableOpacity onPress={() => router.back()} style={s.btnPrimary}>
//                 <Text style={s.btnPrimaryText}>Back to Login</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   )
// }

// const s = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.bg },
//   body: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 },
//   backBtn: { marginBottom: 24 },
//   backText: { color: colors.textDim, ...T.body },
//   title: { ...T.h1, color: colors.textPrimary, marginBottom: 8 },
//   sub: { ...T.body, color: colors.textMuted, marginBottom: 24 },
//   inputGroup: { marginBottom: 24 },
//   label: { ...T.body, color: colors.textMuted, marginBottom: 8 },
//   input: { borderWidth: 1, borderColor: colors.border, padding: 16, borderRadius: 12, color: colors.textPrimary, ...T.body },
//   btnPrimary: { backgroundColor: colors.teal, padding: 16, borderRadius: 12, alignItems: 'center' },
//   btnPrimaryText: { color: colors.textPrimary, ...T.bodyMedium },
//   btnDisabled: { backgroundColor: colors.border },
//   confirmation: { alignItems: 'center' }
// })

import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Button from '../../src/components/common/Button'

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  const handleSubmit = async () => {
    if (!email.includes('@')) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200)) // replace with real API call
    setLoading(false)
    setSent(true)
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          {sent ? (
            <View style={styles.sentState}>
              <View style={styles.iconWrap}><Text style={{ fontSize: 32 }}>📬</Text></View>
              <Text style={styles.heading}>Check your inbox</Text>
              <Text style={styles.sub}>We sent a reset link to{'\n'}<Text style={styles.emailHighlight}>{email}</Text></Text>
              <Text style={styles.sentHint}>Didn't get it? Check spam or <Text style={styles.retryLink} onPress={() => setSent(false)}>try again</Text>.</Text>
              <Button title="Back to sign in" onPress={() => router.replace('/(auth)/login')} variant="secondary" style={{ marginTop: spacing.xxl, width: '100%' }} />
            </View>
          ) : (
            <>
              <View style={styles.iconWrap}><Text style={{ fontSize: 24 }}>🔑</Text></View>
              <Text style={styles.heading}>Forgot password?</Text>
              <Text style={styles.sub}>Enter your email and we'll send you a reset link.</Text>
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={colors.textDim} keyboardType="email-address" autoCapitalize="none" returnKeyType="done" onSubmitEditing={handleSubmit} />
              </View>
              <Button title="Send reset link" onPress={handleSubmit} loading={loading} disabled={!email.includes('@')} size="lg" />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.bg },
  container:     { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xxl },
  backBtn:       { alignSelf: 'flex-start', paddingVertical: spacing.sm, marginBottom: spacing.xxl },
  backText:      { ...T.body, color: colors.textMuted },
  iconWrap:      { width: 56, height: 56, borderRadius: radius.lg, backgroundColor: colors.tealBg, borderWidth: 1, borderColor: colors.tealDark, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  heading:       { ...T.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  sub:           { ...T.body, color: colors.textMuted, marginBottom: spacing.xxl, lineHeight: 22 },
  field:         { gap: spacing.xs, marginBottom: spacing.xl },
  label:         { ...T.captionMedium, color: colors.textSecondary, letterSpacing: 0.3 },
  input:         { backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, ...T.body, color: colors.textPrimary },
  sentState:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emailHighlight:{ color: colors.tealLight, fontWeight: '500' },
  sentHint:      { ...T.bodySmall, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl, lineHeight: 20 },
  retryLink:     { color: colors.tealLight },
})