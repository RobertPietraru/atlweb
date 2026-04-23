import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as tables from '$lib/server/db/schema';
import * as fs from 'fs';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(process.env.DATABASE_URL, { prepare: false });
export const db = drizzle(client);

interface SeedData {
  users: {
    id: string;
    email: string;
    username: string;
    password_hash: string;
    permissions: string;
  }[];
}

async function seed(db: PostgresJsDatabase) {
  const rawUsers = fs.readFileSync('./data/users.json', 'utf-8');
  const users: any[] = JSON.parse(rawUsers);

  // --- Users ---
  if (users.length) {
    console.log(`Inserting ${users.length} users...`);
    await db.insert(tables.user).values(
      users.map((u) => ({
        id: u.id,
        email: u.email,
        username: u.username,
        passwordHash: u.password_hash,
        permissions: JSON.parse(u.permissions ?? '[]'),
      }))
    ).onConflictDoNothing();
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed(db).catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});