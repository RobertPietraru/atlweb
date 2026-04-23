import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
if (!env.DATABASE_URL && env.DEVELOPMENT) throw new Error('DATABASE_URL is not set');
const client = postgres(env.DATABASE_URL || 'postgres://root:mysecretpassword@localhost:5433/local', { prepare: false });
export const db = drizzle(client);
