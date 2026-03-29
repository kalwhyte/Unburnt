import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SupportContactsService } from './support-contacts.service';
import { CreateSupportContactDto, UpdateSupportContactDto } from './dto/support.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('support-contacts')
export class SupportContactsController {
  constructor(private readonly supportContactsService: SupportContactsService) {}

  @Post()
  async create(@Request() req: any, @Body() dto: CreateSupportContactDto) {
    return this.supportContactsService.create(req.user.userId, dto);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.supportContactsService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.supportContactsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateSupportContactDto,
  ) {
    return this.supportContactsService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.supportContactsService.remove(req.user.userId, id);
  }
}