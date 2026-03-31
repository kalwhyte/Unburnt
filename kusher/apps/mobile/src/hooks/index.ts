// // src/hooks/useDashboardStats.ts
// import { useEffect, useState } from 'react'
// import { useOnboardingStore } from '@/store/onboardingStore'
// import { getProgress } from '@/services/api/progress'

// export function useDashboardStats() {
//   const quitDate = useOnboardingStore(s => s.quitDate)
//   const profile  = useOnboardingStore(s => s.profile)
//   const [loading, setLoading] = useState(true)
//   const [stats, setStats] = useState({
//     streak: 0,
//     cigarettesAvoided: 0,
//     moneySaved: 0,
//     lifeRegained: 0,
//   })

//   useEffect(() => {
//     if (!quitDate || !profile) { setLoading(false); return }

//     const qd = new Date(quitDate)
//     const now = new Date()
//     const msPerDay = 86_400_000
//     const daysSince = Math.max(0, Math.floor((now.getTime() - qd.getTime()) / msPerDay))

//     const cigarettesAvoided = daysSince * profile.cigsPerDay
//     const packsAvoided = cigarettesAvoided / 20
//     const moneySaved = packsAvoided * profile.costPerPack
//     // 11 min life gained per cigarette not smoked
//     const lifeRegained = Math.floor((cigarettesAvoided * 11) / 60)

//     setStats({ streak: daysSince, cigarettesAvoided, moneySaved, lifeRegained })
//     setLoading(false)

//     // Also fetch server-side stats for accuracy
//     getProgress().then(data => {
//       if (data) setStats(prev => ({ ...prev, ...data }))
//     })
//   }, [quitDate, profile])

//   return { ...stats, loading }
// }

// // ─────────────────────────────────────────────
// // src/hooks/useNotificationObserver.ts
// // ─────────────────────────────────────────────
// import { useEffect } from 'react'
// import * as Notifications from 'expo-notifications'
// import { useRouter } from 'expo-router'

// export function useNotificationObserver() {
//   const router = useRouter()

//   useEffect(() => {
//     // Handle app launched from notification
//     Notifications.getLastNotificationResponseAsync().then(response => {
//       if (!response) return
//       const data = response.notification.request.content.data as Record<string, string>
//       if (data?.screen) router.push(data.screen as never)
//     })

//     // Handle notification tapped while app is backgrounded / foregrounded
//     const sub = Notifications.addNotificationResponseReceivedListener(response => {
//       const data = response.notification.request.content.data as Record<string, string>
//       if (data?.screen) router.push(data.screen as never)
//     })

//     return () => sub.remove()
//   }, [])
// }

// // ─────────────────────────────────────────────
// // src/hooks/useQuitProgress.ts
// // ─────────────────────────────────────────────
// export interface HealthMilestone {
//   label: string
//   description: string
//   timeMs: number       // time from quit date in ms
//   completed: boolean
//   progress?: number    // 0-1 for in-progress milestones
// }

// const MILESTONES_DEF = [
//   { label: 'Heart rate normalised',    description: '20 minutes', timeMs: 20 * 60 * 1000 },
//   { label: 'Carbon monoxide cleared',  description: '8 hours',    timeMs: 8 * 3600 * 1000 },
//   { label: 'Nicotine levels halved',   description: '48 hours',   timeMs: 48 * 3600 * 1000 },
//   { label: 'Taste & smell improving',  description: '3 days',     timeMs: 3 * 86400 * 1000 },
//   { label: 'Lung function improving',  description: '2 weeks',    timeMs: 14 * 86400 * 1000 },
//   { label: 'Cilia regrowth',           description: '1–9 months', timeMs: 30 * 86400 * 1000 },
//   { label: 'Heart disease risk halved', description: '1 year',    timeMs: 365 * 86400 * 1000 },
// ]

// export function useQuitProgress(quitDateISO: string | null): HealthMilestone[] {
//   if (!quitDateISO) return MILESTONES_DEF.map(m => ({ ...m, completed: false }))
//   const elapsedMs = Date.now() - new Date(quitDateISO).getTime()

//   return MILESTONES_DEF.map((m, i) => {
//     const completed = elapsedMs >= m.timeMs
//     const nextMs = MILESTONES_DEF[i + 1]?.timeMs
//     const prevMs = i > 0 ? MILESTONES_DEF[i - 1].timeMs : 0
//     const inProgress = !completed && elapsedMs >= prevMs
//     const progress = inProgress ? Math.min(1, (elapsedMs - prevMs) / (m.timeMs - prevMs)) : undefined
//     return { ...m, completed, progress }
//   })
// }
