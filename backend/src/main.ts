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
      .setDescription('API de controle de fluxo de caixa')
      .setVersion('1.0')
      .addBearerAuth()
      .build(),
  );

  z.config(z.locales.pt());

  const cleanedDoc = cleanupOpenApiDoc(openApiDoc);

  SwaggerModule.setup('api', app, cleanedDoc, {
    jsonDocumentUrl: '/api-json',
    yamlDocumentUrl: '/api-yaml',
    swaggerOptions: {
      urls: [
        { url: '/api-json', name: 'JSON' },
        { url: '/api-yaml', name: 'YAML' },
      ],
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
