import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DatabaseReadiness } from '@skillforge/platform-database';

@Controller('health')
export class HealthController {
  constructor(private readonly database: DatabaseReadiness) {}

  @Get()
  getHealth(): { status: 'ok' } {
    return { status: 'ok' };
  }

  @Get('live')
  getLiveness(): { status: 'ok' } {
    return { status: 'ok' };
  }

  @Get('ready')
  async getReadiness(): Promise<{ status: 'ok' }> {
    if (!(await this.database.isReady())) {
      throw new ServiceUnavailableException({ status: 'unavailable' });
    }

    return { status: 'ok' };
  }
}
