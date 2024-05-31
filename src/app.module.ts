import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketModule } from './socket/socket.module';
import typeORMConfig from './config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), SocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
