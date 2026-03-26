import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: any) {
    return this.usersService.findById(req.user.userId);
  }

  // @UseGuards(JwtAuthGuard)
  // @Put('me')
  // async updateMe(@Request() req: any, @Body() body: any) {
  //   return this.usersService.updateUser(req.user.userId, body);
  // }
  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMe(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.updateUser(
      req.user.userId,
      updateUserDto
    );
  }
}