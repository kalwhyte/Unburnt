import { Injectable } from '@nestjs/common';
import { StreakService } from './streak.service';

const HEALTH_MILESTONES = [
  { name: 'Blood pressure normalises',      hours: 0.33  },
  { name: 'Carbon monoxide clears',         hours: 8     },
  { name: 'Oxygen levels recover',          hours: 24    },
  { name: 'Nicotine leaves your body',      hours: 48    },
  { name: 'Taste & smell improve',          hours: 48    },
  { name: 'Breathing becomes easier',       hours: 72    },
  { name: '1 week smoke-free',              hours: 168   },
  { name: '2 weeks smoke-free',             hours: 336   },
  { name: '1 month smoke-free',             hours: 720   },
  { name: 'Lung function improves 10%',     hours: 2160  },
  { name: '3 months smoke-free',            hours: 2160  },
  { name: '6 months smoke-free',            hours: 4380  },
  { name: '1 year smoke-free',              hours: 8760  },
  { name: 'Heart disease risk halved',      hours: 43800 },
  { name: 'Stroke risk matches non-smoker', hours: 43800 },
  { name: 'Lung cancer risk halved',        hours: 87600 },
];

@Injectable()
export class HealthTimelineService {
  constructor(private readonly streakService: StreakService) {}

  async getHealthTimeline(userId: string) {
    const streakData = await this.streakService.computeStreak(userId);
    const elapsed    = streakData.currentStreakHours;

    return {
      currentStreakHours: elapsed,
      milestones: HEALTH_MILESTONES.map((m) => ({
        name:            m.name,
        requiredHours:   m.hours,
        achieved:        elapsed >= m.hours,
        progressPercent: Math.min(100, Math.round((elapsed / m.hours) * 100)),
        achievedAt:
          elapsed >= m.hours && streakData.lastSmokingEvent
            ? new Date(streakData.lastSmokingEvent.getTime() + m.hours * 3600000)
            : null,
      })),
      nextMilestone: this.getNextMilestone(elapsed),
    };
  }

  getNextMilestone(currentStreakHours: number) {
    const next = HEALTH_MILESTONES.find((m) => m.hours > currentStreakHours);
    if (!next) return null;
    return {
      name:            next.name,
      requiredHours:   next.hours,
      progressPercent: Math.min(100, Math.round((currentStreakHours / next.hours) * 100)),
    };
  }
}