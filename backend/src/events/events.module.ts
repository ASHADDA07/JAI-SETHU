import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from '../prisma/prisma.module'; // <-- Add this

@Module({
  imports: [PrismaModule], // <-- Add this array
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}