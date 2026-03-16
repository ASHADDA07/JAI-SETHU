// ✅ Added UseGuards to the import list!
import { Controller, Get, Post, Body, Param, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🔓 PUBLIC ROUTE: Anyone can create an account
  @Post()
  async create(@Body() userData: { email: string; fullName: string; role: any; password: string }) {
    return this.usersService.createUser({
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        password: userData.password || "default_password_for_now",
    });
  }

  // 🔒 SECURE ROUTE: Only logged-in users can fetch associates
  @UseGuards(JwtAuthGuard)
  @Get('associates')
  async getAssociates(@Query('excludeUserId') excludeUserId?: string) {
    return this.usersService.findAssociates(excludeUserId);
  }

  // 🔒 SECURE ROUTE: Only logged-in users can search the lawyer directory
  @UseGuards(JwtAuthGuard)
  @Get('lawyers')
  async searchLawyers(@Query('query') query: string) {
    if (query) {
      return this.usersService.findAllLawyers(query);
    }
    return this.usersService.findLawyers();
  }

  // 🔒 SECURE ROUTE: Protect user data lookups
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  // 🔒 SECURE ROUTE: Only logged-in users can update their own profiles
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.usersService.updateUser(id, data);
  }
}