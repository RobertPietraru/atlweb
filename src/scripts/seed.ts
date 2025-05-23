import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { hash } from '@node-rs/argon2';
import postgres from 'postgres';
import * as tables from '$lib/server/db/schema';
if (!process.env.POSTGRES_URL) throw new Error('POSTGRES_URL is not set');
const client = postgres(process.env.POSTGRES_URL, { prepare: false });
export const db = drizzle(client);

async function Auth(db: PostgresJsDatabase) {
  const passwordHash = await hash('password', {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });

  // Insert users
  await db.insert(tables.user).values([
    {
      email: 'admin@pietrocka.com',
      username: 'Robert Pietraru 3 ',
      passwordHash: passwordHash,
      permissions: [
        'exercise.create',
        'exercise.edit',
        'exercise.delete',
        'exercise.view',
        'lesson.create',
        'lesson.edit',
        'lesson.delete',
        'lesson.view',
        'chapter.create',
        'chapter.edit',
        'chapter.delete',
        'chapter.view',
        'course.create',
        'course.edit',
        'course.delete',

        'course.view',
        'course.create',
        'course.edit',
        'course.delete',

        'user.create',
        'user.edit',
        'user.delete',
        'user.view',

        'submission.solve',
      ],
    },
  ]);

  console.log('Seeding complete!');
  process.exit(0);
}




Auth(db).catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
