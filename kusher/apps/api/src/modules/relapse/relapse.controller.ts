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
import { RelapseService } from './relapse.service';
import { CreateRelapseDto } from './dto/relapse.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('relapses')
export class RelapseController {
  constructor(private readonly relapseService: RelapseService) {}

  /**
   * POST /relapses
   * Log a relapse — saves record + fires recovery notification
   */
  @Post()
  async create(@Request() req: any, @Body() dto: CreateRelapseDto) {
    return this.relapseService.create(req.user.userId, dto);
  }

  /**
   * GET /relapses
   * All relapses for the user, newest first
   */
  @Get()
  async findAll(@Request() req: any) {
    return this.relapseService.findAll(req.user.userId);
  }

  /**
   * GET /relapses/summary
   * Total count, cigarettes smoked, days since last relapse, most common trigger
   */
  @Get('summary')
  async summary(@Request() req: any) {
    return this.relapseService.summary(req.user.userId);
  }

  /**
   * GET /relapses/:id
   * Single relapse record
   */
  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.relapseService.findOne(req.user.userId, id);
  }

  /**
   * DELETE /relapses/:id
   * Delete a relapse record
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.relapseService.remove(req.user.userId, id);
  }
}