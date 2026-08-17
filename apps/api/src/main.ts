import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { loadApiConfig } from './app/api.config'

async function bootstrap() {
  const config = loadApiConfig(process.env);
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  app.enableShutdownHooks();

  await app.listen(config.port);

  Logger.log(`🚀 Application is running on: http://localhost:${config.port}/${globalPrefix}`,);
}

bootstrap();
