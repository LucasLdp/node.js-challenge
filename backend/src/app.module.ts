import { ZodValidationPipe, ZodSerializerInterceptor } from 'nestjs-zod';
import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { Module, Provider } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnvFunction } from '@/config/env-validation';
import { PrismaModule } from 'nestjs-prisma';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaPg } from '@prisma/adapter-pg';
import { UsersModule, CashFlowsModule, AuthModule } from '@/modules';
import { HttpExceptionFilter } from '@/shared/filters/http-exception.filter';
import { CacheModule } from '@nestjs/cache-manager';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import { SharedCacheModule } from '@/shared/cache/cache.module';

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
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        const ttl = configService.get<number>('CACHE_TTL') ?? 60000;

        const stores = redisUrl
          ? [
              new Keyv({
                store: new CacheableMemory({ ttl, lruSize: 5000 }),
              }),
              new KeyvRedis(redisUrl),
            ]
          : [
              new Keyv({
                store: new CacheableMemory({ ttl, lruSize: 5000 }),
              }),
            ];

        return { stores };
      },
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
    SharedCacheModule,
    UsersModule,
    CashFlowsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [...AppProviders],
})
export class AppModule {}
