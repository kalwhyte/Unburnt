import { StyleSheet } from 'react-native'
import { colors, radius, spacing, T } from '../../src/constants/theme'

export const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: colors.bg },
  scroll:     { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: spacing.md },
  loader:     { alignItems: 'center', paddingTop: 60 },
  pageTitle:  { ...T.h1, color: colors.textPrimary, marginBottom: 2 },
  pageSub:    { ...T.bodySmall, color: colors.textMuted, marginBottom: spacing.lg },

  tabRow:        { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.border, padding: 3, marginBottom: spacing.lg, gap: 3 },
  tabBtn:        { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: radius.sm },
  tabBtnActive:  { backgroundColor: colors.tealDark },
  tabText:       { ...T.captionMedium, color: colors.textMuted },
  tabTextActive: { color: colors.tealLight },

  card:     { marginBottom: spacing.md },
  cardLabel:{ ...T.captionMedium, color: colors.textMuted, letterSpacing: 0.8, marginBottom: spacing.md },

  // Hero
  heroRow:     { flexDirection: 'row', gap: spacing.lg, alignItems: 'center' },
  heroStats:   { flex: 1, gap: 0 },
  heroStatRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7 },
  heroStatKey: { ...T.caption, color: colors.textMuted },
  heroStatVal: { ...T.captionMedium, color: colors.textPrimary },
  heroDivider: { height: 0.5, backgroundColor: colors.border },

  // Ring
  ringWrap:   { width: 88, height: 88, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  ringCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  ringVal:    { fontSize: 20, fontWeight: '600', color: colors.tealLight, lineHeight: 22 },
  ringLbl:    { fontSize: 9, color: colors.textMuted, letterSpacing: 0.5, marginTop: 2 },

  // Charts
  chartRow:  { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 52 },
  chartCol:  { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: 3 },
  chartBar:  { width: '100%', borderRadius: 2 },
  barDayLbl: { fontSize: 9, color: colors.textDim },
  chartNote: { ...T.caption, color: colors.textDim, marginTop: spacing.xs, textAlign: 'right' },

  // Savings
  savingsAmount: { fontSize: 36, fontWeight: '600', color: colors.teal, lineHeight: 40, marginBottom: 2 },
  savingsSub:    { ...T.caption, color: colors.textMuted, marginBottom: spacing.md },
  savingsRow:    { flexDirection: 'row', gap: spacing.sm },
  savingsBox:    { flex: 1, backgroundColor: colors.tealBg, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.tealDark, padding: spacing.md, alignItems: 'center' },
  savingsBoxVal: { ...T.bodySmall, fontWeight: '500', color: colors.tealLight },
  savingsBoxLbl: { fontSize: 10, color: colors.textMuted, marginTop: 3 },

  // Cravings
  cravingRow:  { flexDirection: 'row', marginBottom: spacing.md },
  cravingStat: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  cravingVal:  { fontSize: 22, fontWeight: '600', color: colors.textPrimary, lineHeight: 24 },
  cravingLbl:  { fontSize: 10, color: colors.textMuted, marginTop: 3 },
  cravingSep:  { width: 0.5, backgroundColor: colors.border, marginVertical: spacing.sm },

  // Milestones
  sectionTitle:          { ...T.captionMedium, color: colors.textMuted, letterSpacing: 0.8, marginBottom: spacing.md, marginTop: spacing.sm },
  milestoneRow:          { flexDirection: 'row', gap: spacing.md },
  milestoneTrack:        { alignItems: 'center' },
  milestoneCircle:       { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  milestoneCircleDone:   { backgroundColor: colors.teal, borderColor: colors.teal },
  milestoneCircleNext:   { borderColor: colors.teal },
  milestoneCheck:        { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  milestoneDot:          { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.teal },
  milestoneConnector:    { width: 1.5, flex: 1, minHeight: 20, backgroundColor: colors.border, marginVertical: 3 },
  milestoneConnectorDone:{ backgroundColor: colors.teal },
  milestoneBody:         { flex: 1, paddingBottom: spacing.lg },
  milestoneTitle:        { ...T.bodySmall, color: colors.textMuted, fontWeight: '500', marginBottom: 2 },
  milestoneTitleDone:    { color: colors.textPrimary },
  milestoneTitleNext:    { color: colors.tealLight },
  milestoneSub:          { ...T.caption, color: colors.textDim, marginBottom: 2 },
  milestoneProgressRow:  { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  milestoneProgressTrack:{ width: 80, height: 3, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  milestoneProgressFill: { height: '100%', backgroundColor: colors.teal, borderRadius: 2 },
  milestoneProgressPct:  { ...T.caption, color: colors.textMuted },
})