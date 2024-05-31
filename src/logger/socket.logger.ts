import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class SocketLogger extends ConsoleLogger {}
