import React from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, T, spacing, radius } from '../src/constants/theme'
import { useNotificationFeed } from '../src/hooks/useNotificationObserver'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)   return 'just now'
  if (m < 60)  return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24)  return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function typeIcon(type: string) {
  const icons: Record<string, string> = {
    MILESTONE:   '🏆',
    CRAVING:     '🚨',
    CHECKIN:     '☀️',
    STREAK:      '🔥',
    RELAPSE:     '💪',
    SYSTEM:      'ℹ️',
  }
  return icons[type] ?? '🔔'
}

export default function NotificationsScreen() {
  const router = useRouter()
  const { notifications, unreadCount, loading, readOne, readAll, remove, refresh } = useNotificationFeed()

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 ? (
          <Pressable onPress={readAll} style={styles.readAllBtn}>
            <Text style={styles.readAllText}>Mark all read</Text>
          </Pressable>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.teal} />}
      >
        {notifications.length === 0 && !loading ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>🔔</Text>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyDesc}>
              We'll notify you of milestones, craving alerts, and daily check-ins.
            </Text>
          </View>
        ) : (
          notifications.map((n) => (
            <Pressable
              key={n.id}
              style={[styles.item, !n.read && styles.itemUnread]}
              onPress={() => readOne(n.id)}
            >
              <View style={styles.iconWrap}>
                <Text style={{ fontSize: 20 }}>{typeIcon(n.type)}</Text>
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={styles.itemTitle}>{n.title}</Text>
                {n.body ? <Text style={styles.itemBody}>{n.body}</Text> : null}
                <Text style={styles.itemTime}>{timeAgo(n.createdAt)}</Text>
              </View>
              {!n.read && <View style={styles.unreadDot} />}
              <Pressable onPress={() => remove(n.id)} style={styles.deleteBtn}>
                <Text style={{ color: colors.textDim, fontSize: 16 }}>×</Text>
              </Pressable>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.bg },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  backBtn:      { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backText:     { ...T.h2, color: colors.teal },
  title:        { ...T.h3, color: colors.textPrimary },
  readAllBtn:   { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  readAllText:  { ...T.caption, color: colors.teal },
  scroll:       { paddingVertical: spacing.md, flexGrow: 1 },
  empty:        { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingTop: 80 },
  emptyTitle:   { ...T.h3, color: colors.textPrimary },
  emptyDesc:    { ...T.body, color: colors.textMuted, textAlign: 'center', paddingHorizontal: spacing.xl, lineHeight: 22 },
  item:         { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.borderSoft },
  itemUnread:   { backgroundColor: colors.tealBg },
  iconWrap:     { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  itemTitle:    { ...T.bodySmall, color: colors.textPrimary, fontWeight: '500' },
  itemBody:     { ...T.caption, color: colors.textMuted, lineHeight: 18 },
  itemTime:     { ...T.caption, color: colors.textDim },
  unreadDot:    { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.teal, marginTop: 6 },
  deleteBtn:    { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
})