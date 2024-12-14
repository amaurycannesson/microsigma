import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'sqlite.db',
  },
  verbose: true,
  strict: true,
});
