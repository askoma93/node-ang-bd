import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

describe('Worker application context', () => {
    it('starts and closes successfully', async () => {
        const app = await NestFactory.createApplicationContext(AppModule);

        expect(app).toBeDefined();

        await app.close();
    });
});