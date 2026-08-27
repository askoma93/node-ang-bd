import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { PrismaService } from '@skillforge/platform-database';
import request from 'supertest';
import { AppModule } from './app.module';

jest.setTimeout(120_000);

describe('database-backed API', () => {
  let app: INestApplication;
  let container: StartedPostgreSqlContainer;
  let originalDatabaseUrl: string | undefined;

  beforeAll(async () => {
    originalDatabaseUrl = process.env['DATABASE_URL'];
    container = await new PostgreSqlContainer('postgres:17-alpine')
      .withDatabase('skillforge')
      .withUsername('skillforge')
      .withPassword('skillforge_test')
      .start();

    process.env['DATABASE_URL'] =
      `${container.getConnectionUri()}?schema=public&connect_timeout=2`;
    const workspaceRoot = join(__dirname, '..', '..', '..', '..');
    const prismaCli = join(
      workspaceRoot,
      'node_modules',
      'prisma',
      'build',
      'index.js',
    );
    const migrationEnvironment = {
      ...process.env,
      DATABASE_URL: process.env['DATABASE_URL'],
    };

    execFileSync(process.execPath, [prismaCli, 'migrate', 'deploy'], {
      cwd: workspaceRoot,
      env: migrationEnvironment,
      stdio: 'pipe',
    });
    execFileSync(process.execPath, [prismaCli, 'migrate', 'deploy'], {
      cwd: workspaceRoot,
      env: migrationEnvironment,
      stdio: 'pipe',
    });

    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
    if (container) await container.stop();

    if (originalDatabaseUrl === undefined) {
      delete process.env['DATABASE_URL'];
    } else {
      process.env['DATABASE_URL'] = originalDatabaseUrl;
    }
  });

  it('reports liveness and database readiness', async () => {
    expect(app.get(PrismaService, { each: true })).toHaveLength(1);

    await request(app.getHttpServer())
      .get('/api/health/live')
      .expect(200, { status: 'ok' });
    await request(app.getHttpServer())
      .get('/api/health/ready')
      .expect(200, { status: 'ok' });
  });

  it('returns an empty catalog for a clean database', async () => {
    await request(app.getHttpServer()).get('/api/skills').expect(200, []);
  });

  it('returns a populated catalog in deterministic order', async () => {
    const prisma = app.get(PrismaService);
    await prisma.skill.createMany({
      data: [
        { name: 'TypeScript', slug: 'typescript' },
        { name: 'Angular', slug: 'angular' },
      ],
    });

    const response = await request(app.getHttpServer())
      .get('/api/skills')
      .expect(200);

    expect(response.body).toEqual([
      expect.objectContaining({ name: 'Angular', slug: 'angular' }),
      expect.objectContaining({ name: 'TypeScript', slug: 'typescript' }),
    ]);
    expect(response.body[0]).toEqual({
      id: expect.any(String),
      name: 'Angular',
      slug: 'angular',
    });
  });

  it('enforces unique slugs in PostgreSQL', async () => {
    const prisma = app.get(PrismaService);

    await expect(
      prisma.skill.create({
        data: { name: 'Angular duplicate', slug: 'angular' },
      }),
    ).rejects.toMatchObject({ code: 'P2002' });
  });

  it('returns a bounded 503 without leaking credentials when the database is unavailable', async () => {
    const availableDatabaseUrl = process.env['DATABASE_URL'];
    process.env['DATABASE_URL'] =
      'postgresql://do-not-leak:super-secret@127.0.0.1:1/skillforge?connect_timeout=1';
    let unavailableApp: INestApplication | undefined;

    try {
      const module = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
      unavailableApp = module.createNestApplication();
      unavailableApp.setGlobalPrefix('api');
      await unavailableApp.init();

      const startedAt = Date.now();
      const response = await request(unavailableApp.getHttpServer())
        .get('/api/health/ready')
        .expect(503);

      expect(Date.now() - startedAt).toBeLessThan(2_000);
      expect(response.text).not.toContain('do-not-leak');
      expect(response.text).not.toContain('super-secret');
      expect(response.body).toEqual({ status: 'unavailable' });
    } finally {
      if (unavailableApp) await unavailableApp.close();
      process.env['DATABASE_URL'] = availableDatabaseUrl;
    }
  });
});
