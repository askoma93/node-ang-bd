import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

const DEFAULT_TIMEOUT_MS = 1_000;

@Injectable()
export class DatabaseReadiness {
  constructor(private readonly prisma: PrismaService) {}

  async isReady(timeoutMs = DEFAULT_TIMEOUT_MS): Promise<boolean> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<boolean>((resolve) => {
      timer = setTimeout(() => resolve(false), timeoutMs);
    });
    const query = this.prisma.$queryRaw`SELECT 1`
      .then(() => true)
      .catch(() => false);

    try {
      return await Promise.race([query, timeout]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}
