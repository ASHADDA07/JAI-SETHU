import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // 1. Send Message
  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    // --- DEBUG LOG START ---
    console.log("📨 Incoming Message Request:", createMessageDto);
    // --- DEBUG LOG END ---
    
    return this.messagesService.create(createMessageDto);
  }
  
  // 2. Get History
  @Get('history')
  async getHistory(@Query('u1') userId1: string, @Query('u2') userId2: string) {
    // FIX: Changed from 'getChatHistory' to 'getHistory' to match Service
    return this.messagesService.getHistory(userId1, userId2);
  }

  // 3. Get Inbox
  @Get('inbox')
  async getInbox(@Query('userId') userId: string) {
    return this.messagesService.getInbox(userId);
  }
}