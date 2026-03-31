import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../../src/constants/theme'
import Button from '../../src/components/common/Button'

const FAQS = [
  { q: 'How do I log a craving?',            a: 'Tap the "Log craving" quick action on your dashboard, or go to the craving log from the bottom menu.' },
  { q: 'Will my streak reset if I log a smoke?', a: 'Yes — honesty is key to your success. But you can restart immediately from the relapse recovery screen.' },
  { q: 'How are my savings calculated?',     a: 'We multiply your cigarettes avoided by your cost-per-cigarette (your pack price ÷ 20). Update it in Settings.' },
  { q: 'Can I change my quit date?',         a: 'Yes — go to Settings → Quit plan → Quit date.' },
  { q: 'How do push notifications work?',    a: 'We send a maximum of 3 per day — a morning check-in, a craving alert at your peak times, and milestone celebrations.' },
  { q: 'Is my data private?',               a: 'Yes. Your data is encrypted and never sold or shared with third parties. See our Privacy Policy for full details.' },
]

const RESOURCES = [
  { icon: '🏥', title: 'NHS Smokefree',       url: 'https://www.nhs.uk/live-well/quit-smoking/', desc: 'Free NHS quit support' },
  { icon: '📞', title: 'Smokefree helpline',  url: 'tel:0300123 1044', desc: 'Call 0300 123 1044 (UK)' },
  { icon: '💊', title: 'NRT information',     url: 'https://www.nhs.uk/live-well/quit-smoking/using-nicotine-replacement-therapy/', desc: 'Patches, gum, and more' },
]

export default function SupportScreen() {
  const [expanded, setExpanded]   = useState<number | null>(null)
  const [message, setMessage]     = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Help & Support</Text>

        {/* Quick contact */}
        <View style={styles.contactCard}>
          <Text style={styles.contactHeading}>Need help fast?</Text>
          <Text style={styles.contactSub}>Our support team usually replies within a few hours.</Text>
          {submitted ? (
            <View style={styles.sentState}>
              <Text style={styles.sentText}>✓ Message sent — we'll be in touch soon.</Text>
            </View>
          ) : (
            <>
              <TextInput
                style={styles.messageInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Describe your issue or question..."
                placeholderTextColor={colors.textDim}
                multiline
                numberOfLines={3}
              />
              <Button
                title="Send message"
                onPress={() => { if (message.trim()) setSubmitted(true) }}
                disabled={!message.trim()}
                size="md"
                style={{ marginTop: spacing.md }}
              />
            </>
          )}
        </View>

        {/* FAQ */}
        <Text style={styles.sectionTitle}>Frequently asked questions</Text>
        <View style={styles.faqList}>
          {FAQS.map((faq, i) => (
            <Pressable
              key={i}
              onPress={() => setExpanded(expanded === i ? null : i)}
              style={[styles.faqItem, i < FAQS.length - 1 && styles.faqBorder]}
            >
              <View style={styles.faqRow}>
                <Text style={styles.faqQ}>{faq.q}</Text>
                <Text style={styles.faqChevron}>{expanded === i ? '−' : '+'}</Text>
              </View>
              {expanded === i && (
                <Text style={styles.faqA}>{faq.a}</Text>
              )}
            </Pressable>
          ))}
        </View>

        {/* External resources */}
        <Text style={styles.sectionTitle}>Quit smoking resources</Text>
        <View style={styles.resources}>
          {RESOURCES.map((r) => (
            <Pressable
              key={r.title}
              style={styles.resourceCard}
              onPress={() => Linking.openURL(r.url)}
            >
              <Text style={styles.resourceIcon}>{r.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.resourceTitle}>{r.title}</Text>
                <Text style={styles.resourceDesc}>{r.desc}</Text>
              </View>
              <Text style={styles.resourceArrow}>↗</Text>
            </Pressable>
          ))}
        </View>

        {/* App info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Kusher v1.0.0</Text>
          <Pressable onPress={() => Linking.openURL('mailto:support@kusher.app')}>
            <Text style={styles.appInfoLink}>support@kusher.app</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: colors.bg },
  scroll:          { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: spacing.md },
  pageTitle:       { ...T.h1, color: colors.textPrimary, marginBottom: spacing.xl },
  contactCard:     { backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl },
  contactHeading:  { ...T.h3, color: colors.textPrimary, marginBottom: spacing.xs },
  contactSub:      { ...T.bodySmall, color: colors.textMuted, marginBottom: spacing.lg },
  messageInput:    { backgroundColor: colors.bg, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, ...T.body, color: colors.textPrimary, minHeight: 80, textAlignVertical: 'top' },
  sentState:       { backgroundColor: colors.tealBg, borderRadius: radius.md, padding: spacing.md },
  sentText:        { ...T.bodySmall, color: colors.tealLight },
  sectionTitle:    { ...T.captionMedium, color: colors.textMuted, letterSpacing: 0.5, marginBottom: spacing.sm },
  faqList:         { backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', marginBottom: spacing.xl },
  faqItem:         { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  faqBorder:       { borderBottomWidth: 0.5, borderBottomColor: colors.borderSoft },
  faqRow:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQ:            { ...T.bodySmall, color: colors.textPrimary, flex: 1, paddingRight: spacing.md },
  faqChevron:      { ...T.h3, color: colors.tealLight, lineHeight: 20 },
  faqA:            { ...T.bodySmall, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 20 },
  resources:       { gap: spacing.sm, marginBottom: spacing.xl },
  resourceCard:    { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, gap: spacing.md },
  resourceIcon:    { fontSize: 22 },
  resourceTitle:   { ...T.bodyMedium, color: colors.textPrimary },
  resourceDesc:    { ...T.caption, color: colors.textMuted, marginTop: 1 },
  resourceArrow:   { ...T.body, color: colors.tealLight },
  appInfo:         { alignItems: 'center', gap: spacing.xs, paddingTop: spacing.md },
  appInfoText:     { ...T.caption, color: colors.textDim },
  appInfoLink:     { ...T.caption, color: colors.tealLight },
})