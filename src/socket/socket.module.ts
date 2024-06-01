import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Park } from './entities/park.entity';
import { SocketGateway } from './socket.gateway';
import { SocketLogger } from 'src/logger/socket.logger';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Park]), ConfigModule],
  providers: [SocketGateway, SocketLogger],
})
export class SocketModule {}
