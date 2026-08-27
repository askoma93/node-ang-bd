import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseReadiness } from '@skillforge/platform-database';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: DatabaseReadiness,
          useValue: { isReady: jest.fn().mockResolvedValue(true) },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('reports liveness without querying the database', () => {
    expect(controller.getLiveness()).toEqual({ status: 'ok' });
  });

  it('reports readiness when the database is available', async () => {
    await expect(controller.getReadiness()).resolves.toEqual({ status: 'ok' });
  });
});
