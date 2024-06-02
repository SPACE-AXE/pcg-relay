import { ForbiddenException, UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import axios from 'axios';
import { ApiUrl, ManageCodeEnv } from 'src/constants/constants';
import { SocketExceptionFilter } from 'src/socket-exception/socket-exception.filter';
import { ConfigService } from '@nestjs/config';
import { EnterDto } from './dto/enter.dto';
import { SocketLogger } from 'src/logger/socket.logger';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  transports: ['websocket'],
  cookie: true,
})
@UseFilters(SocketExceptionFilter)
export class SocketGateway implements OnGatewayConnection {
  constructor(
    private readonly configService: ConfigService,
    private readonly socketLogger: SocketLogger,
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(@ConnectedSocket() socket: Socket) {
    if (this.configService.get('NODE_ENV') !== 'production') return;

    if (
      socket.handshake.address.includes('127.0.0.1') ||
      socket.handshake.address.includes('localhost')
    )
      return;
    if (
      socket.handshake.headers['manage-code'] &&
      typeof socket.handshake.headers['manage-code'] === 'string'
    ) {
      if (
        socket.handshake.headers['manage-code'] !==
        this.configService.get(ManageCodeEnv)
      ) {
        socket.emit('error', new ForbiddenException('Unauthorized'));
        socket.disconnect();
      }
    } else {
      socket.emit('error', new ForbiddenException('Unauthorized'));
      socket.disconnect();
    }

    this.socketLogger.log('Client connected: ' + socket.handshake.address);
  }

  @SubscribeMessage('enter')
  async handleEnter(@MessageBody() data: EnterDto) {
    const result = await axios.post(`${ApiUrl}/v1/parking-transaction`, data, {
      headers: {
        'manage-code': this.configService.get(ManageCodeEnv),
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
          'manage-code': this.configService.get(ManageCodeEnv),
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
          'manage-code': this.configService.get(ManageCodeEnv),
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
          'manage-code': this.configService.get(ManageCodeEnv),
        },
      },
    );
    return result.data;
  }

  @SubscribeMessage('getUnpaid')
  async handleGetUnpaid(@MessageBody() data: EnterDto) {
    const result = await axios.get(
      `${ApiUrl}/v1/parking-transaction/unpaid?carNum=${data.carNum}`,
      {
        headers: {
          'manage-code': this.configService.get(ManageCodeEnv),
        },
      },
    );
    return result.data;
  }
}
