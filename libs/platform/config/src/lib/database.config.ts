export interface DatabaseConfig {
  readonly url: string;
}

const POSTGRES_PROTOCOLS = new Set(['postgres:', 'postgresql:']);

export function loadDatabaseConfig(env: NodeJS.ProcessEnv): DatabaseConfig {
  const value = env['DATABASE_URL'];

  if (!value) {
    throw new Error('DATABASE_URL is required');
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL URL');
  }

  if (
    !POSTGRES_PROTOCOLS.has(url.protocol) ||
    !url.hostname ||
    !url.pathname.slice(1)
  ) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL URL');
  }

  return { url: value };
}
