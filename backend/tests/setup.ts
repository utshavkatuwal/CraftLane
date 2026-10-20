import { PrismaClient } from '@prisma/client';

/* Craftlane — Test database setup
 *
 * This setup runs before all tests. It checks for a TEST_DATABASE_URL
 * environment variable. If PostgreSQL is not available, tests that require
 * the database will be skipped with a clear message.
 *
 * To run tests locally:
 *   1. Install PostgreSQL
 *   2. Create a test database: createdb craftlane_test
 *   3. Set TEST_DATABASE_URL=postgresql://user:pass@localhost:5432/craftlane_test
 *   4. Run: npm run prisma:migrate:dev -- --schema=prisma/schema.prisma --database-url="$TEST_DATABASE_URL"
 *   5. Run: npm test
 */

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

export async function setupDatabase() {
  const databaseUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn(
      'WARNING: No DATABASE_URL or TEST_DATABASE_URL set. Database tests will be skipped.'
    );
    return;
  }

  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    console.warn('WARNING: Cannot connect to test database. Database tests will be skipped.');
    console.warn(String(err));
  }
}

export async function teardownDatabase() {
  await prisma.$disconnect();
}
