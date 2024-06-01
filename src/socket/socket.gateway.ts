import { ForbiddenException, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { Park } from './entities/park.entity';
import axios from 'axios';
import { EnterDto } from './dto/enter.dto';
import { ApiUrl, ManageCodeEnv } from 'src/constants/constants';
import { SocketExceptionFilter } from 'src/socket-exception/socket-exception.filter';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  transports: ['websocket'],
  cookie: true,
})
@UseFilters(SocketExceptionFilter)
export class SocketGateway implements OnGatewayConnection {
  constructor(
    @InjectRepository(Park) private readonly parkRepository: Repository<Park>,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(@ConnectedSocket() socket: Socket) {
    console.log(socket.handshake.auth.token);
    if (
      socket.handshake.address.includes('127.0.0.1') ||
      socket.handshake.address.includes('localhost')
    )
      return;
    if (socket.handshake.auth.token) {
      const parkInfo = await this.parkRepository.findOne({
        where: { manageCode: socket.handshake.auth.token },
        select: ['id', 'ip'],
      });
      if (!parkInfo) {
        socket.emit('error', new ForbiddenException('Unauthorized'));
        socket.disconnect();
      }
    } else {
      socket.emit('error', new ForbiddenException('Unauthorized'));
      socket.disconnect();
    }
  }

  @SubscribeMessage('enter')
  async handleEnter(@MessageBody() data: EnterDto) {
    const result = await axios.post(`${ApiUrl}/v1/parking-transaction`, data, {
      headers: {
        ManageCode: this.configService.get(ManageCodeEnv),
      },
    });
    return result.data;
  }

  @SubscribeMessage('chargeStart')
  async handleChargeStart(@MessageBody() data: EnterDto) {
    const result = await axios.patch(
      `${ApiUrl}/v1/parking-transaction/charge-start`,
      data,
      {
        headers: {
          ManageCode: this.configService.get(ManageCodeEnv),
        },
      },
    );
    return result.data;
  }

  @SubscribeMessage('chargeFinish')
  async handleChargeEnd(@MessageBody() data: EnterDto) {
    const result = await axios.patch(
      `${ApiUrl}/v1/parking-transaction/charge-finish`,
      data,
      {
        headers: {
          ManageCode: this.configService.get(ManageCodeEnv),
        },
      },
    );
    return result.data;
  }

  @SubscribeMessage('exit')
  async handleExit(@MessageBody() data: EnterDto) {
    const result = await axios.post(
      `${ApiUrl}/v1/parking-transaction/exit`,
      data,
      {
        headers: {
          ManageCode: this.configService.get(ManageCodeEnv),
        },
      },
    );
    return result.data;
  }
}
