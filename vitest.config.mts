import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
          exclude: ['**/*.int.test.ts'],
          // Unit tests never touch a database; these only satisfy env validation on import.
          env: {
            DATABASE_URI: 'postgresql://unit:unit@127.0.0.1:5432/unit',
            PAYLOAD_SECRET: 'unit-test-secret-unit-test-secret-0000',
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'int',
          include: ['tests/int/**/*.int.test.ts'],
          setupFiles: ['./tests/int/setup.ts'],
          fileParallelism: false,
          testTimeout: 60_000,
          hookTimeout: 120_000,
        },
      },
    ],
  },
})
