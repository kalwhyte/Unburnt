import { StyleSheet } from 'react-native'
import { colors, radius, spacing, T } from '../../src/constants/theme'

// ─── Styles ────────────────────────────────────────────────────────
export const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },

  // Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    ...T.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    ...T.h1,
    color: colors.textPrimary,
    fontSize: 32,
  },
  notifBtn: {
    width: 48,
    height: 48,
    backgroundColor: colors.tealDark,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  notifIcon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.danger,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  // Quick Actions
  quickActionsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  quickActionBtn: {
    flex: 1,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  quickActionIcon: {
    fontSize: 24,
  },
  quickActionLabel: {
    ...T.captionMedium,
    color: colors.textMuted,
  },

  // Stats
  statsSection: {
    gap: spacing.sm,
  },

  // Milestone
  milestoneContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestoneTitle: {
    ...T.bodyBold,
    color: colors.textPrimary,
  },
  milestoneTag: {
    ...T.caption,
    color: colors.teal,
    backgroundColor: colors.tealBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  milestoneDesc: {
    ...T.bodySmall,
    color: colors.textMuted,
    lineHeight: 20,
  },
  progressBg: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.teal,
    borderRadius: radius.sm,
  },
  progressLabel: {
    ...T.caption,
    color: colors.textDim,
    textAlign: 'center',
  },

  // Promos
  promoSection: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...T.h3,
    color: colors.textPrimary,
  },
  promoScroll: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  promoCard: {
    width: 160,
    height: 140,
    borderRadius: radius.lg,
    padding: spacing.md,
    justifyContent: 'space-between',
    borderWidth: 1,
    overflow: 'hidden',
  },
  promoCard1: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  promoCard2: {
    backgroundColor: colors.tealDark,
    borderColor: colors.teal,
  },
  promoCard3: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoTagContainer: {
    alignSelf: 'flex-start',
  },
  promoTag: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.teal,
    letterSpacing: 1,
  },
  promoTitle: {
    ...T.bodySmall,
    color: '#fff',
    fontWeight: '700',
  },
  promoCode: {
    ...T.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },

  // Focus
  focusCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  focusItemsContainer: {
    gap: spacing.md,
  },
  focusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  focusIcon: {
    fontSize: 24,
  },
  focusText: {
    ...T.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },

  // Activity
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  activityItems: {
    gap: spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityText: {
    ...T.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },

  // Log Button
  logButtonContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  logButton: {
    height: 52,
    backgroundColor: colors.teal,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logButtonText: {
    ...T.bodyBold,
    color: '#fff',
    fontSize: 16,
  },
})
