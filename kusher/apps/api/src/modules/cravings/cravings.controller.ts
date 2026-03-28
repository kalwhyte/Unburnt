import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CravingsService } from './cravings.service';
import { CreateCravingLogDto, QueryCravingLogDto } from './dto/craving-log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cravings')
export class CravingsController {
  constructor(private readonly cravingsService: CravingsService) {}

  /**
   * POST /cravings
   * Log a new craving
   */
  @Post()
  async create(@Request() req: any, @Body() dto: CreateCravingLogDto) {
    return this.cravingsService.create(req.user.userId, dto);
  }

  /**
   * GET /cravings
   * Paginated list — ?from, ?to, ?triggerId, ?outcome, ?page, ?limit
   */
  @Get()
  async findAll(@Request() req: any, @Query() query: QueryCravingLogDto) {
    return this.cravingsService.findAll(req.user.userId, query);
  }

  /**
   * GET /cravings/summary/outcomes
   * Count by outcome + resist rate — ?from, ?to (default last 30 days)
   */
  @Get('summary/outcomes')
  async outcomeSummary(
    @Request() req: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.cravingsService.outcomeSummary(req.user.userId, { from, to });
  }

  /**
   * GET /cravings/summary/daily
   * Craving count + avg intensity per day — ?from, ?to (default last 30 days)
   */
  @Get('summary/daily')
  async dailySummary(
    @Request() req: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.cravingsService.dailySummary(req.user.userId, { from, to });
  }

  /**
   * GET /cravings/:id
   * Get a single craving log
   */
  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.cravingsService.findOne(req.user.userId, id);
  }

  /**
   * DELETE /cravings/:id
   * Delete a craving log
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.cravingsService.remove(req.user.userId, id);
  }
}