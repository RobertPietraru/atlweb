import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { hash } from '@node-rs/argon2';
import postgres from 'postgres';
import * as tables from '$lib/server/db/schema';
if (!process.env.POSTGRES_URL) throw new Error('POSTGRES_URL is not set');
const client = postgres(process.env.POSTGRES_URL, { prepare: false });
export const db = drizzle(client);

async function truncateAllTables() {
  tables.tableSchema.forEach(async (table) => {
    await db.delete(table);
  })
  console.log('Truncated all tables');
}



async function Auth(db: PostgresJsDatabase) {
  const passwordHash = await hash('password', {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });

  // Insert users
  await db.insert(tables.user).values([
    { email: 'admin@pietrocka.com', username: 'admin', passwordHash: passwordHash },
  ]);

  const users = await db.select().from(tables.user);
  await db.insert(tables.user_permissions).values(tables.permissionsList.map(permission => ({
    user: users[0].id,
    permission: permission,
  })));

  console.log('Seeding complete!');
  process.exit(0);
}


truncateAllTables().then(() => {
  Auth(db).catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
});

