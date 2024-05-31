import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Socket } from 'socket.io';
import { SocketLogger } from 'src/logger/socket.logger';

@Catch(AxiosError)
export class SocketExceptionFilter implements ExceptionFilter {
  constructor(private readonly socketLogger: SocketLogger) {}
  catch(exception: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const socket = ctx.getClient<Socket>();
    const callback = host.getArgByIndex(2);

    this.socketLogger.error(exception.response.data);

    if (callback && typeof callback === 'function') {
      callback(exception.response.data);
    } else {
      socket.emit('error', exception.response.data);
    }
  }
}
