import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  // 1. Save a new message
  async create(createMessageDto: CreateMessageDto) {
    const { content, senderId, receiverId } = createMessageDto;
    
    return this.prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
      },
    });
  }

  // 2. Get history between two users
  async getHistory(userId1: string, userId2: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      orderBy: { createdAt: 'asc' }, // Oldest first
    });
  }

  // 3. Get Inbox (List of people I talked to)
  async getInbox(userId: string) {
    // Find all messages involving this user
    const messages = await this.prisma.message.findMany({
        where: {
            OR: [{ senderId: userId }, { receiverId: userId }]
        },
        orderBy: { createdAt: 'desc' },
        include: { sender: true, receiver: true }
    });

    // Group by the "Other Person"
    const map = new Map();
    
    for (const msg of messages) {
        const otherPerson = msg.senderId === userId ? msg.receiver : msg.sender;
        if (!map.has(otherPerson.id)) {
            map.set(otherPerson.id, {
                id: otherPerson.id,
                name: otherPerson.fullName || otherPerson.email, // Fallback to email if name is missing
                lastMsg: msg.content,
                time: msg.createdAt
            });
        }
    }

    return Array.from(map.values());
  }
}