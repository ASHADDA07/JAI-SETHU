import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async send(@Body() body: { senderId: string; receiverId: string; content: string }) {
    return this.messagesService.sendMessage(body.senderId, body.receiverId, body.content);
  }

  @Get('history')
  async getHistory(@Query('u1') u1: string, @Query('u2') u2: string) {
    return this.messagesService.getChatHistory(u1, u2);
  }

  @Get('inbox')
  async getInbox(@Query('userId') userId: string) {
    return this.messagesService.getInbox(userId);
  }
}