import { ZodValidationPipe, ZodSerializerInterceptor } from 'nestjs-zod';
import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { Module, Provider } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validateEnvFunction } from '@/config/env-validation';
import { PrismaModule } from 'nestjs-prisma';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaPg } from '@prisma/adapter-pg';
import { UsersModule, CashFlowsModule, AuthModule } from '@/modules';
import { HttpExceptionFilter } from '@/shared/filters/http-exception.filter';

const AppProviders: Provider[] = [
  AppService,
  {
    provide: APP_PIPE,
    useClass: ZodValidationPipe,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ZodSerializerInterceptor,
  },
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnvFunction,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        prismaOptions: {
          adapter: new PrismaPg({
            connectionString: process.env.DATABASE_URL,
          }),
        },
      },
    }),
    CqrsModule.forRoot(),
    UsersModule,
    CashFlowsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [...AppProviders],
})
export class AppModule {}
