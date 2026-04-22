export interface HealthMilestone {
  label: string
  description: string
  timeMs: number
  completed: boolean
  progress?: number
}

const MILESTONES_DEF = [
  { label: 'Heart rate normalised',    description: '20 minutes', timeMs: 20 * 60 * 1000 },
  { label: 'Carbon monoxide cleared',  description: '8 hours',    timeMs: 8 * 3600 * 1000 },
  { label: 'Nicotine levels halved',   description: '48 hours',   timeMs: 48 * 3600 * 1000 },
  { label: 'Taste & smell improving',  description: '3 days',     timeMs: 3 * 86400 * 1000 },
  { label: 'Lung function improving',  description: '2 weeks',    timeMs: 14 * 86400 * 1000 },
  { label: 'Cilia regrowth',           description: '1–9 months', timeMs: 30 * 86400 * 1000 },
  { label: 'Heart disease risk halved', description: '1 year',    timeMs: 365 * 86400 * 1000 },
]

export function useQuitProgress(quitDateISO: string | null): HealthMilestone[] {
  if (!quitDateISO) return MILESTONES_DEF.map(m => ({ ...m, completed: false }))
  const elapsedMs = Date.now() - new Date(quitDateISO).getTime()

  return MILESTONES_DEF.map((m, i) => {
    const completed = elapsedMs >= m.timeMs
    const nextMs = MILESTONES_DEF[i + 1]?.timeMs
    const prevMs = i > 0 ? MILESTONES_DEF[i - 1].timeMs : 0
    const inProgress = !completed && elapsedMs >= prevMs
    const progress = inProgress ? Math.min(1, (elapsedMs - prevMs) / (m.timeMs - prevMs)) : undefined
    return { ...m, completed, progress }
  })
}