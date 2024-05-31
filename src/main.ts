import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  const port = process.env.NODE_ENV === 'production' ? 3000 : 3010;
  await app.listen(port);
}
bootstrap();
