import {
	ConnectedSocket,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentEntity } from 'src/comments/entities/comment.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;


  // ---------- User connected ---------- //

	async handleConnection(@ConnectedSocket() client: Socket) {
		console.log(`${client.id} connected`)
	}
	
  // ---------- User disconnected ---------- //

	async handleDisconnect(@ConnectedSocket() client: Socket) {
		console.log(`${client.id} disconnected`)
	}

	  // ---------- Add message to Chat ---------- //
	
	sendComment(comment: CommentEntity) {
		this.server.emit('comments', comment);
	}
}