import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  // Send a message
  async sendMessage(senderId: string, receiverId: string, content: string) {
    return this.prisma.message.create({
      data: { senderId, receiverId, content },
    });
  }

  // Get chat history between two users
  async getChatHistory(userId1: string, userId2: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
            { senderId: userId1, receiverId: userId2 },
            { senderId: userId2, receiverId: userId1 },
        ]
      },
      orderBy: { createdAt: 'asc' }, // Oldest messages first
    });
  }

  // Get list of people user has talked to (Inbox)
  async getInbox(userId: string) {
    // Find all messages involving this user
    const messages = await this.prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      include: { sender: true, receiver: true },
      orderBy: { createdAt: 'desc' }
    });

    // Extract unique contacts
    const contacts = new Map();
    messages.forEach(msg => {
       const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
       if (!contacts.has(otherUser.id)) {
           contacts.set(otherUser.id, {
               id: otherUser.id,
               name: otherUser.fullName,
               lastMsg: msg.content,
               time: msg.createdAt
           });
       }
    });
    return Array.from(contacts.values());
  }
}