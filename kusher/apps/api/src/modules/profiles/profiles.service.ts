
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { QuitGoal } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(userId: string, data: CreateProfileDto) {
    const profileData = {
      ...data,
      quitGoal: data.quitGoal ?? QuitGoal.QUIT_NOW,
      cigarettesPerDay: data.cigarettesPerDay ?? 0,
    };

    return this.prisma.profile.upsert({
      where: { userId },
      create: { userId, ...profileData },
      update: profileData,
      // data: {
      //   userId,
      //   ...data,
      //   quitGoal: data.quitGoal ?? QuitGoal.QUIT_NOW, 
      //   cigarettesPerDay: data.cigarettesPerDay ?? 0,
      // },
    });
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    return this.prisma.profile.update({
      where: { userId },
      data,
    });
  }
}