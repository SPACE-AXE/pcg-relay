import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkHealth() {
    return { result: 'OK' };
  }
}
