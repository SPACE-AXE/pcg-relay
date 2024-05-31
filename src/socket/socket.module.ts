import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Park } from './entities/park.entity';
import { SocketGateway } from './socket.gateway';
import { SocketLogger } from 'src/logger/socket.logger';

@Module({
  imports: [TypeOrmModule.forFeature([Park])],
  providers: [SocketGateway, SocketLogger],
})
export class SocketModule {}
