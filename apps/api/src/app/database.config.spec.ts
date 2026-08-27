import { loadDatabaseConfig } from '@skillforge/platform-config';

describe('loadDatabaseConfig', () => {
  it('accepts PostgreSQL URLs without exposing a parsed credential object', () => {
    const url = 'postgresql://user:secret@localhost:5432/skillforge';

    expect(loadDatabaseConfig({ DATABASE_URL: url })).toEqual({ url });
  });

  it('requires DATABASE_URL', () => {
    expect(() => loadDatabaseConfig({})).toThrow('DATABASE_URL is required');
  });

  it.each([
    'not-a-url',
    'mysql://localhost/skillforge',
    'postgresql:///skillforge',
    'postgresql://localhost',
  ])('rejects invalid PostgreSQL URL %s', (url) => {
    expect(() => loadDatabaseConfig({ DATABASE_URL: url })).toThrow(
      'DATABASE_URL must be a valid PostgreSQL URL',
    );
  });
});
