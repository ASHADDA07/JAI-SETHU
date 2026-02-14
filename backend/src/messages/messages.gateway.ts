import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow connections from frontend
  },
})
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  afterInit(server: Server) {
    console.log('✅ Socket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`🔌 Client Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client Disconnected: ${client.id}`);
  }

  // 1. Listen for 'joinRoom' (User comes online)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: string,
  ) {
    client.join(userId); // Join a private room named after their User ID
    console.log(`👤 User ${userId} joined their private room.`);
  }

  // 2. Listen for 'sendMessage' (User sends a text)
  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() createMessageDto: CreateMessageDto) {
    // A. Save to Database (So history is kept)
    const savedMessage = await this.messagesService.create(createMessageDto);

    // B. Send to Receiver Instantly (Real-time magic)
    this.server
      .to(createMessageDto.receiverId)
      .emit('receiveMessage', savedMessage);

    return savedMessage;
  }
}