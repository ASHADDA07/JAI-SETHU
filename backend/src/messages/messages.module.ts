import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller'; // Ensure this matches filename
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MessagesController], // <--- MUST be here
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}