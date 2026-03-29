import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { StreakService } from './streak.service';

@Injectable()
export class MoneyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly streakService: StreakService,
  ) {}

  async getMoneySaved(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const streakData        = await this.streakService.computeStreak(userId);
    const cigarettesPerPack = profile.cigarettesPerPack ?? 20;
    const packCost          = Number(profile.packCost ?? 0);
    const costPerCigarette  = cigarettesPerPack > 0 ? packCost / cigarettesPerPack : 0;

    const avoided = (hours: number) =>
      Math.floor((profile.cigarettesPerDay / 24) * hours);

    const hoursToday = Math.min(streakData.currentStreakHours, 24);
    const hoursWeek  = Math.min(streakData.currentStreakHours, 168);
    const hoursMonth = Math.min(streakData.currentStreakHours, 720);
    const hoursTotal = streakData.currentStreakHours;

    return {
      costPerCigarette:  +costPerCigarette.toFixed(4),
      packCost,
      cigarettesPerPack,
      cigarettesPerDay:  profile.cigarettesPerDay,
      saved: {
        today: +(avoided(hoursToday) * costPerCigarette).toFixed(2),
        week:  +(avoided(hoursWeek)  * costPerCigarette).toFixed(2),
        month: +(avoided(hoursMonth) * costPerCigarette).toFixed(2),
        total: +(avoided(hoursTotal) * costPerCigarette).toFixed(2),
      },
      cigarettesAvoided: {
        today: avoided(hoursToday),
        week:  avoided(hoursWeek),
        month: avoided(hoursMonth),
        total: avoided(hoursTotal),
      },
    };
  }
}