import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketLogger } from 'src/logger/socket.logger';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [SocketGateway, SocketLogger],
})
export class SocketModule {}
