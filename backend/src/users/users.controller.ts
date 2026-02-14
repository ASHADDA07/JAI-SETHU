import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() userData: { email: string; fullName: string; role: any; password: string }) {
    return this.usersService.createUser({
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        password: userData.password || "default_password_for_now", // Changed passwordHash to password
    });
  }

  @Get('associates')
  async getAssociates(@Query('excludeUserId') excludeUserId?: string) {
    return this.usersService.findAssociates(excludeUserId);
  }

  // Combined the two 'lawyers' endpoints into one to avoid "Duplicate" errors
  @Get('lawyers')
  async searchLawyers(@Query('query') query: string) {
    if (query) {
      return this.usersService.findAllLawyers(query);
    }
    return this.usersService.findLawyers();
  }

  @Get()
  async getUserByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.usersService.updateUser(id, data);
  }
}