import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateSupportContactDto, UpdateSupportContactDto } from './dto/support.dto';

@Injectable()
export class SupportContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateSupportContactDto) {
    return this.prisma.supportContact.create({
      data: {
        userId,
        name:         dto.name ?? '',
        phone:        dto.phone,
        email:        dto.email,
        relationship: dto.relationship,
      },
    });
  }

  async findAll(userId: string) {
    const contacts = await this.prisma.supportContact.findMany({
      where:   { userId },
      orderBy: { createdAt: 'asc' },
    });

    return { total: contacts.length, data: contacts };
  }

  async findOne(userId: string, id: string) {
    const contact = await this.prisma.supportContact.findUnique({ where: { id } });

    if (!contact || contact.userId !== userId) {
      throw new NotFoundException(`Support contact ${id} not found`);
    }

    return contact;
  }

  async update(userId: string, id: string, dto: UpdateSupportContactDto) {
    await this.findOne(userId, id);
    return this.prisma.supportContact.update({
      where: { id },
      data:  { ...dto },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.supportContact.delete({ where: { id } });
  }
}