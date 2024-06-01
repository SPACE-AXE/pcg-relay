import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ManageCodeHeader } from './constants/constants';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*', exposedHeaders: ManageCodeHeader });
  const port = process.env.NODE_ENV === 'production' ? 3000 : 3010;
  await app.listen(port);
}
bootstrap();
