import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(data: any) {
    return this.prisma.event.create({ data });
  }

  async getUserEvents(userId: string) {
    return this.prisma.event.findMany({
      where: { userId },
      orderBy: { date: 'asc' } 
    });
  }
}