import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST http://localhost:3000/users (Create User)
  @Post()
  async create(@Body() userData: { email: string; fullName: string; role: any; passwordHash: string }) {
    return this.usersService.createUser({
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        passwordHash: userData.passwordHash || "default_hash_for_now", 
    });
  }
  @Get('associates')
  async getAssociates(@Query('excludeUserId') excludeUserId?: string) {
    return this.usersService.findAssociates(excludeUserId);
  }

  // GET http://localhost:3000/users/lawyers?query=divorce
  @Get('lawyers')
  async searchLawyers(@Query('query') query: string) {
    return this.usersService.findAllLawyers(query);
  }

  // GET http://localhost:3000/users?email=test@test.com
  @Get()
  async getUserByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  // PUT http://localhost:3000/users/:id
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.usersService.updateUser(id, data);
  }
}