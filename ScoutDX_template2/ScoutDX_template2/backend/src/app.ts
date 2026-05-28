import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database';
import { AuthMiddleware } from './middleware/auth';
import { RoutesModule } from './routes';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), RoutesModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
