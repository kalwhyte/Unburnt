// import React from 'react'
// import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native'
// import { useRouter } from 'expo-router'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { colors, T } from '../../src/constants/theme'

// export default function WelcomeScreen() {
//   const router = useRouter()

//   return (
//     <View style={s.container}>
//       <View style={s.content}>
//         <View style={s.logoContainer}>
//           <Text style={s.logoEmoji}>🔥</Text>
//           <Text style={s.logoText}>Unburnt</Text>
//         </View>

//         <View style={s.hero}>
//           <Text style={s.title}>Break free from smoking.</Text>
//           <Text style={s.sub}>
//             Join thousands of people using Unburnt to reclaim their health and save money.
//           </Text>
//         </View>

//         <View style={s.footer}>
//           <TouchableOpacity 
//             style={s.btnPrimary} 
//             onPress={() => router.push('/(auth)/register')}
//           >
//             <Text style={s.btnPrimaryText}>Get Started</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={s.btnSecondary} 
//             onPress={() => router.push('/(auth)/login')}
//           >
//             <Text style={s.btnSecondaryText}>I already have an account</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   )
// }

// const s = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.bg },
//   content: { flex: 1, padding: 24, justifyContent: 'space-between' },
//   logoContainer: { marginTop: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
//   logoEmoji: { fontSize: 32 },
//   logoText: { ...T.h1, color: colors.tealLight, letterSpacing: -0.5 },
//   hero: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   title: { ...T.h1, color: colors.textPrimary, textAlign: 'center', marginBottom: 16 },
//   sub: { ...T.body, color: colors.textMuted, textAlign: 'center' },
//   footer: { gap: 12, marginBottom: 32 },
//   btnPrimary: { backgroundColor: colors.teal, paddingHorizontal: 24, paddingVertical: 16, borderRadius: 12 },
//   btnPrimaryText: { ...T.bodyMedium, color: colors.textPrimary },
//   btnSecondary: { paddingHorizontal: 24, paddingVertical: 16 },
//   btnSecondaryText: { ...T.bodyMedium, color: colors.textMuted },
// });

import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Button from '../../src/components/common/Button'

export default function WelcomeScreen() {
  const router = useRouter()
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.iconWrap}>
            <Text style={styles.iconEmoji}>🌿</Text>
          </View>
          <Text style={styles.appName}>Kusher</Text>
          <Text style={styles.tagline}>Your quit journey,{'\n'}one breath at a time.</Text>
          <Text style={styles.sub}>Science-backed tools to manage cravings,{'\n'}track progress, and stay free.</Text>
        </View>

        <View style={styles.statsRow}>
          {[
            { val: '14 min', label: 'avg craving duration' },
            { val: '94%',    label: 'success with support' },
            { val: '3×',     label: 'better with tracking' },
          ].map((s) => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button title="Get started — it's free" onPress={() => router.push('/(auth)/register')} size="lg" />
          <Pressable onPress={() => router.push('/(auth)/login')} style={styles.loginLink}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginAccent}>Sign in</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'space-between', paddingTop: spacing.xxl, paddingBottom: spacing.xl },
  hero:      { alignItems: 'center', flex: 1, justifyContent: 'center' },
  iconWrap:  { width: 72, height: 72, borderRadius: radius.xl, backgroundColor: colors.tealBg, borderWidth: 1, borderColor: colors.tealDark, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  iconEmoji: { fontSize: 32 },
  appName:   { ...T.h1, color: colors.textPrimary, fontSize: 32, marginBottom: spacing.sm, letterSpacing: -0.8 },
  tagline:   { ...T.h2, color: colors.tealLight, textAlign: 'center', marginBottom: spacing.md, lineHeight: 28 },
  sub:       { ...T.body, color: colors.textMuted, textAlign: 'center', lineHeight: 22 },
  statsRow:  { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 0.5, borderColor: colors.border, paddingVertical: spacing.lg, marginBottom: spacing.xl },
  stat:      { flex: 1, alignItems: 'center' },
  statVal:   { ...T.h3, color: colors.teal, marginBottom: 2 },
  statLabel: { ...T.caption, color: colors.textMuted, textAlign: 'center' },
  actions:   { gap: spacing.md },
  loginLink: { alignItems: 'center', paddingVertical: spacing.sm },
  loginText: { ...T.bodySmall, color: colors.textMuted },
  loginAccent:{ color: colors.tealLight, fontWeight: '500' },
})