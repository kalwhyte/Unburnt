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
import { SmokingLogsService } from './smoking-logs.service';
import { CreateSmokingLogDto, QuerySmokingLogDto } from './dto/smoking-log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('smoking-logs')
export class SmokingLogsController {
  constructor(private readonly smokingLogsService: SmokingLogsService) {}

  /**
   * POST /smoking-logs
   * Create a new smoking log
   */
  @Post()
  async create(@Request() req: any, @Body() dto: CreateSmokingLogDto) {
    return this.smokingLogsService.create(req.user.userId, dto);
  }

  /**
   * GET /smoking-logs
   * Paginated list — optional ?from, ?to, ?triggerId, ?page, ?limit
   */
  @Get()
  async findAll(@Request() req: any, @Query() query: QuerySmokingLogDto) {
    return this.smokingLogsService.findAll(req.user.userId, query);
  }

  /**
   * GET /smoking-logs/summary/daily
   * Total cigarettes per day — optional ?from, ?to (defaults to last 30 days)
   */
  @Get('summary/daily')
  async dailySummary(
    @Request() req: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.smokingLogsService.dailySummary(req.user.userId, { from, to });
  }

  /**
   * GET /smoking-logs/summary/weekly
   * Total cigarettes per ISO week — last 12 weeks
   */
  @Get('summary/weekly')
  async weeklySummary(@Request() req: any) {
    return this.smokingLogsService.weeklyAggregates(req.user.userId);
  }

  /**
   * GET /smoking-logs/:id
   * Get a single log (ownership enforced)
   */
  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.smokingLogsService.findOne(req.user.userId, id);
  }

  /**
   * DELETE /smoking-logs/:id
   * Delete a log (ownership enforced)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.smokingLogsService.remove(req.user.userId, id);
  }
}