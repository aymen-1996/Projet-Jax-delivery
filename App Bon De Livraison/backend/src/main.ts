import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); 

  // Enable CORS
  app.enableCors({
    origin: 'http://127.0.0.1:4000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  // This allows all origins, methods, and headers. Adjust as needed.
  await app.listen(3000);
}
bootstrap();
