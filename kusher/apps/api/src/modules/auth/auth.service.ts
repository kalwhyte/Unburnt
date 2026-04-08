import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from './../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        firstName: dto.firstName,
      },
    });

    return this.generateToken(user.id, user.email, user.firstName ?? undefined);
  }

  async login(dto: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user.id, user.email, user.firstName ?? undefined, user.lastName ?? undefined, user.avatarUrl ?? undefined);
  }

  private async generateToken(userId: string, email: string, firstName?: string, lastName?: string, avatarUrl?: string) {
    const payload = { sub: userId, email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: userId,
        email,
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        avatarUrl: avatarUrl ?? null,
      },
    };
  }
}
