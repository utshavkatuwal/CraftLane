import { PrismaClient } from '@prisma/client'

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
 *   4. Apply migrations: npm run prisma:migrate:dev
 *   5. Run: npm test
 */

let prismaInstance: PrismaClient | null = null
let databaseAvailable = false

export async function getPrisma(): Promise<PrismaClient> {
  if (!prismaInstance) {
    const databaseUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL
    if (!databaseUrl) {
      databaseAvailable = false
      throw new Error('No DATABASE_URL or TEST_DATABASE_URL set')
    }
    prismaInstance = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    })
    try {
      await prismaInstance.$connect()
      await prismaInstance.$queryRaw`SELECT 1`
      databaseAvailable = true
    } catch {
      databaseAvailable = false
      prismaInstance = null
    }
  }
  if (!prismaInstance) {
    throw new Error('Database connection failed')
  }
  return prismaInstance
}

export async function setupDatabase(): Promise<void> {
  const databaseUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL
  if (!databaseUrl) {
    console.warn(
      'WARNING: No DATABASE_URL or TEST_DATABASE_URL set. Database tests will be skipped.',
    )
    return
  }

  try {
    await getPrisma()
  } catch (err) {
    console.warn(
      'WARNING: Cannot connect to test database. Database tests will be skipped.',
    )
    console.warn(String(err))
  }
}

export async function teardownDatabase(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect()
    prismaInstance = null
  }
}

export { databaseAvailable }
