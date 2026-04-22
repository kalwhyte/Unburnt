export type Period = '7d' | '30d' | '3m'
export const PERIODS: { key: Period; label: string }[] = [
  { key: '7d',  label: '7 days'    },
  { key: '30d', label: '30 days'   },
  { key: '3m',  label: '3 months'  },
]

export const PLACEHOLDER_MILESTONES = [
  { id: '1', title: '1 day smoke-free',    subtitle: 'Heart rate normalizes',       achieved: true,  achievedAt: 'Day 1',  progress: undefined },
  { id: '2', title: '1 week smoke-free',   subtitle: 'Circulation improving',       achieved: true,  achievedAt: 'Day 7',  progress: undefined },
  { id: '3', title: '2 weeks smoke-free',  subtitle: 'Lung function improving',     achieved: false, achievedAt: null,     progress: 64 },
  { id: '4', title: '1 month smoke-free',  subtitle: 'Cilia in lungs recovering',   achieved: false, achievedAt: null,     progress: 35 },
  { id: '5', title: '3 months smoke-free', subtitle: 'Circulation fully improved',  achieved: false, achievedAt: null,     progress: undefined },
]