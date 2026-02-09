import { cleanupOpenApiDoc } from 'nestjs-zod';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import z from 'zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const openApiDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Kinvo Challenge API')
      .setDescription('API for Kinvo Challenge')
      .setVersion('1.0')
      .build(),
  );

  z.config(z.locales.pt());

  SwaggerModule.setup('api', app, cleanupOpenApiDoc(openApiDoc));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
