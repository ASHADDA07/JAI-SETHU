import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // 🔒 Locked!
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: any) {
    return this.eventsService.createEvent(createEventDto);
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.eventsService.getUserEvents(userId);
  }
}