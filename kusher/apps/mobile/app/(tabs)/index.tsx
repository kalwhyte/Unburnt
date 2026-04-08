import React, { useEffect, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDashboardStats } from '../../src/hooks/useDashboardStats'
import { useNotificationFeed } from '../../src/hooks/useNotificationObserver'
import { StreakHero } from '@/components/dashboard/StreakHero'
import { StatCard } from '@/components/dashboard/StatCard'
import { CravingSOS } from '@/components/rescue/CravingSOS'
import { s } from './styles'
import { colors } from "@/constants/theme"
import { useAuthStore } from '@/store/useAuthStore'

Dimensions.get('window')

// // ─── Animated Components ────────────────────────────────────────────────
function FadeInUpView({ children, delay = 0, style }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <Animated.View
      style={[
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        style,
      ]}
    >
      {children}
    </Animated.View>
  )
}

function ScaleInView({ children, delay = 0 }: any) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      {children}
    </Animated.View>
  )
}

// ─── Header Component ──────────────────────────────────────────────────
function HeaderSection({ firstName, unreadCount, onNotification }: any) {
  const shakeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (unreadCount > 0) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start()
      setTimeout(() => {
        Animated.timing(shakeAnim, { toValue: 0, duration: 0, useNativeDriver: true }).start()
      }, 1000)
      return () => shakeAnim.stopAnimation()
    }
  }, [unreadCount])

  const shakeInterpolate = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-5, 5],
  })

  return (
    <FadeInUpView delay={0}>
      <View style={s.headerContainer}>
        <View style={s.greetingSection}>
          <Text style={s.greeting}>Welcome back</Text>
          <Text style={s.name}>{firstName} 👋</Text>
        </View>

        <Animated.View style={{ transform: [{ translateX: shakeInterpolate }] }}>
          <TouchableOpacity 
            style={s.notifBtn} 
            onPress={onNotification}>
            <Text style={s.notifIcon}>🔔</Text>
            {unreadCount > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </FadeInUpView>
  )
}

const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if (type === 'light') return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  else if (type === 'medium') return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  else return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
}
// ─── Quick Actions ────────────────────────────────────────────────────
function QuickActionsBar({ onLog, onJournal, onStats }: any) {
  return (
    <FadeInUpView delay={100} style={s.quickActionsContainer}>
      <TouchableOpacity
        style={s.quickActionBtn}
        onPress={() => {
          triggerHaptic('light')
          onLog()
          }}
      >
        <Text style={s.quickActionIcon}>➕</Text>
        <Text style={s.quickActionLabel}>Log</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.quickActionBtn}
        onPress={onJournal}>
        <Text style={s.quickActionIcon}>📝</Text>
        <Text style={s.quickActionLabel}>Journal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.quickActionBtn} onPress={onStats}>
        <Text style={s.quickActionIcon}>📊</Text>
        <Text style={s.quickActionLabel}>Insights</Text>
      </TouchableOpacity>
    </FadeInUpView>
  )
}

// ─── Stats Row Component ─────────────────────────────────────────────
function StatsSection({ cigarettesAvoided, moneySaved, lifeRegained }: any) {
  return (
    <FadeInUpView delay={200} style={s.statsSection}>
      <ScaleInView delay={200}>
        <StatCard
          label="Not Smoked"
          value={cigarettesAvoided?.toString() ?? '0'}
          unit="cigarettes"
          icon="🚫"
        />
      </ScaleInView>

      <ScaleInView delay={250}>
        <StatCard
          label="Money Saved"
          value={`₦${moneySaved?.toLocaleString() ?? '0'}`}
          unit="total"
          icon="💰"
        />
      </ScaleInView>

      <ScaleInView delay={300}>
        <StatCard
          label="Life Regained"
          value={`${lifeRegained ?? '0'}h`}
          unit="hours"
          icon="⏰"
        />
      </ScaleInView>
    </FadeInUpView>
  )
}

// ─── Milestone Card Component ───────────────────────────────────────
function MilestoneCard({ daysUntil = 2 }: any) {
  const progress = (30 - daysUntil) / 30

  return (
    <FadeInUpView delay={350} style={s.milestoneContainer}>
      <View style={s.milestoneHeader}>
        <Text style={s.milestoneTitle}>Next Health Milestone</Text>
        <Text style={s.milestoneTag}>Day {30 - daysUntil}</Text>
      </View>

      <Text style={s.milestoneDesc}>
        Your sense of taste and smell will significantly improve in {daysUntil} days.
      </Text>

      <View style={s.progressBg}>
        <Animated.View
          style={[
            s.progressFill,
            { width: `${Math.min(progress * 100, 100)}%` },
          ]}
        />
      </View>

      <Text style={s.progressLabel}>21 days to full taste recovery</Text>
    </FadeInUpView>
  )
}

// ─── Promo Cards Component ──────────────────────────────────────────
const PromoSection: React.FC = () => {
  return (
    <FadeInUpView delay={400} style={s.promoSection}>
      <Text style={s.sectionTitle}>Exclusive Offers</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.promoScroll}
        scrollEventThrottle={16}
      >
        <ScaleInView delay={420}>
          <TouchableOpacity style={[s.promoCard, s.promoCard1]}>
            <View style={s.promoTagContainer}>
              <Text style={s.promoTag}>PROMO</Text>
            </View>
            <Text style={s.promoTitle}>20% Off Patches</Text>
            <Text style={s.promoCode}>UNBURNT20</Text>
          </TouchableOpacity>
        </ScaleInView>

        <ScaleInView delay={470}>
          <TouchableOpacity style={[s.promoCard, s.promoCard2]}>
            <View style={s.promoTagContainer}>
              <Text style={[s.promoTag, { color: colors.teal }]}>CHALLENGE</Text>
            </View>
            <Text style={s.promoTitle}>30-Day Quest</Text>
            <Text style={s.promoCode}>Win Rewards</Text>
          </TouchableOpacity>
        </ScaleInView>

        <ScaleInView delay={520}>
          <TouchableOpacity style={[s.promoCard, s.promoCard3]}>
            <Text style={s.featureEmoji}>🧘</Text>
            <Text style={s.promoTitle}>Calm Craving</Text>
            <Text style={s.promoCode}>2-min exercise</Text>
          </TouchableOpacity>
        </ScaleInView>
      </ScrollView>
    </FadeInUpView>
  )
}

// ─── Daily Focus Component ──────────────────────────────────────────
const DailyFocusCard: React.FC = () => {
  return (
    <FadeInUpView delay={550} style={s.focusCard}>
      <Text style={s.sectionTitle}>Today's Focus</Text>

      <View style={s.focusItemsContainer}>
        <View style={s.focusItem}>
          <Text style={s.focusIcon}>🧠</Text>
          <Text style={s.focusText}>Avoid triggers after meals</Text>
        </View>

        <View style={s.focusItem}>
          <Text style={s.focusIcon}>🚶</Text>
          <Text style={s.focusText}>Take a 10-min walk</Text>
        </View>

        <View style={s.focusItem}>
          <Text style={s.focusIcon}>💧</Text>
          <Text style={s.focusText}>Stay hydrated</Text>
        </View>
      </View>
    </FadeInUpView>
  )
}

// ─── Recent Activity Component ──────────────────────────────────────
const RecentActivityCard: React.FC = () => {
  return (
    <FadeInUpView delay={600} style={s.activityCard}>
      <Text style={s.sectionTitle}>Recent Activity</Text>

      <View style={s.activityItems}>
        <View style={s.activityItem}>
          <Text style={s.activityEmoji}>✅</Text>
          <Text style={s.activityText}>Avoided cigarette at 2:14 PM</Text>
        </View>

        <View style={s.activityItem}>
          <Text style={s.activityEmoji}>💰</Text>
          <Text style={s.activityText}>Saved ₦500 today</Text>
        </View>

        <View style={s.activityItem}>
          <Text style={s.activityEmoji}>🔥</Text>
          <Text style={s.activityText}>3-day streak achieved</Text>
        </View>
      </View>
    </FadeInUpView>
  )
}

// ─── Main Screen Component ──────────────────────────────────────────
export const DashboardHomeScreen: React.FC = () => {
  const router = useRouter()
  const { user } = useAuthStore()
  const { unreadCount } = useNotificationFeed()
  const { streak, cigarettesAvoided, moneySaved, lifeRegained } = useDashboardStats()

  const getFirstName = (user: any) => {
    if (user?.firstName) {
      return user.firstName.split(' ')[0]
    } else if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'Friend'
  }

  const firstName = getFirstName(user)

  return (
    <SafeAreaView style={s.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <HeaderSection
          firstName={firstName}
          unreadCount={unreadCount}
          onNotification={() => router.push('/notifications')}
        />

        {/* Streak Hero */}
        <FadeInUpView delay={50}>
          <StreakHero days={streak} />
        </FadeInUpView>

        {/* Quick Actions */}
        <QuickActionsBar
          onLog={() => router.push('/logs/smoking')}
          onJournal={() => router.push('/journal')}
          onStats={() => router.push('/(tabs)/insights')}
        />

        {/* Stats Row */}
        <StatsSection
          cigarettesAvoided={cigarettesAvoided}
          moneySaved={moneySaved}
          lifeRegained={lifeRegained}
        />

        {/* Craving SOS */}
        <FadeInUpView delay={320}>
          <CravingSOS onPress={() => {
            triggerHaptic('medium')
            router.push('/craving-rescue')
          }} />
        </FadeInUpView>

        {/* Milestone */}
        <MilestoneCard daysUntil={2} />

        {/* Promos */}
        <PromoSection />

        {/* Daily Focus */}
        <DailyFocusCard />

        {/* Recent Activity */}
        <RecentActivityCard />

        {/* Log Button */}
        <FadeInUpView delay={650} style={s.logButtonContainer}>
          <TouchableOpacity
            style={s.logButton}
            onPress={() => router.push('/logs/smoking')}
          >
            <Text style={s.logButtonText}>+ Log a Cigarette</Text>
          </TouchableOpacity>
        </FadeInUpView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DashboardHomeScreen
