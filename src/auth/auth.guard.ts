import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(context.getType());
    const socket = context.switchToWs().getClient<Socket>();
    const token = socket.handshake.query;

    console.log(socket.handshake.query);

    if (!token) {
      return false;
    }

    return true;
  }
}
