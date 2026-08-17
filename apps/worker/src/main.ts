import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  Logger.log(`Worker started =(O_o)=`);

  const keepAlive = setInterval(() => {
    Logger.debug('Worker heartbeat');
  }, 60_000);

  const shutdown = async (): Promise<void> => {
    clearInterval(keepAlive);

    await app.close();

    Logger.log(`Worker stopped =(O_o)=`);
  }

  process.once('SIGINT', () => void shutdown());
  process.once('SIGTERM', () => void shutdown());
}

bootstrap().then();
