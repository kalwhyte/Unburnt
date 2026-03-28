import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TriggersService } from './triggers.service';
import { CreateTriggerDto, AddUserTriggerDto } from './dto/trigger-log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('triggers')
export class TriggersController {
  constructor(private readonly triggersService: TriggersService) {}

  /**
   * GET /triggers
   * Full list of all available triggers (reference/seed data)
   */
  @Get()
  async findAll() {
    return this.triggersService.findAll();
  }

  /**
   * POST /triggers
   * Create a new global trigger (admin/seed use)
   */
  @Post()
  async create(@Body() dto: CreateTriggerDto) {
    return this.triggersService.create(dto);
  }

  /**
   * GET /triggers/me
   * Get all triggers the authenticated user has selected
   */
  @Get('me')
  async getUserTriggers(@Request() req: any) {
    return this.triggersService.getUserTriggers(req.user.userId);
  }

  /**
   * POST /triggers/me
   * Add a trigger to the authenticated user's list
   */
  @Post('me')
  async addUserTrigger(@Request() req: any, @Body() dto: AddUserTriggerDto) {
    return this.triggersService.addUserTrigger(req.user.userId, dto);
  }

  /**
   * DELETE /triggers/me/:triggerId
   * Remove a trigger from the authenticated user's list
   */
  @Delete('me/:triggerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeUserTrigger(
    @Request() req: any,
    @Param('triggerId') triggerId: string,
  ) {
    return this.triggersService.removeUserTrigger(req.user.userId, triggerId);
  }
}