import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { ErrorHandlerFilter } from './middleware/errorHandler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalFilters(new ErrorHandlerFilter());

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);
  console.log(`Backend listening on ${port}`);
}

bootstrap();
