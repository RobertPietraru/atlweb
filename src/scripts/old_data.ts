import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as tables from '$lib/server/db/schema';
import * as fs from 'fs';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(process.env.DATABASE_URL, { prepare: false });
export const db = drizzle(client);

interface SeedData {
  courses: {
    id: string;
    name: string;
    description: string;
    order: string;
  }[];
  chapters: {
    id: string;
    name: string;
    description: string;
    order: string;
    course_id: string;
  }[];
  lessons: {
    id: string;
    name: string;
    teaser: string;
    chapter_id: string;
    blocks: string;
    order: string;
  }[];
  exercises: {
    id: string;
    name: string;
    creation_date: string;
    summary: string;
    instructions: string;
    initial_html: string;
    initial_css: string;
    initial_javascript: string;
  }[];
  submissions: {
    id: string;
    exercise_id: string;
    user_id: string;
    submission_date: string;
    checked: string;
    need_help: string;
    javascript_code: string;
    html_code: string;
    css_code: string;
  }[];
  sessions: {
    id: string;
    user_id: string;
    expires_at: string;
  }[];
  users: {
    id: string;
    email: string;
    username: string;
    password_hash: string;
    permissions: string;
  }[];
}

async function seed(db: PostgresJsDatabase) {
  const raw = fs.readFileSync('./data/data.json', 'utf-8');
  const data: SeedData = JSON.parse(raw);

  // --- Courses ---
  if (data.courses?.length) {
    console.log(`Inserting ${data.courses.length} courses...`);
    await db.insert(tables.course).values(
      data.courses.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        order: parseInt(c.order),
      }))
    ).onConflictDoNothing();
  }

  // --- Chapters ---
  if (data.chapters?.length) {
    console.log(`Inserting ${data.chapters.length} chapters...`);
    await db.insert(tables.chapter).values(
      data.chapters.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        order: parseInt(c.order),
        course: c.course_id,
      }))
    ).onConflictDoNothing();
  }

  // --- Lessons ---
  if (data.lessons?.length) {
    console.log(`Inserting ${data.lessons.length} lessons...`);
    await db.insert(tables.lesson).values(
      data.lessons.map((l) => ({
        id: l.id,
        name: l.name,
        teaser: l.teaser,
        chapterId: l.chapter_id,
        blocks: JSON.parse(l.blocks ?? '[]'),
        order: parseInt(l.order),
      }))
    ).onConflictDoNothing();
  }

  // --- Exercises ---
  if (data.exercises?.length) {
    console.log(`Inserting ${data.exercises.length} exercises...`);
    await db.insert(tables.exercise).values(
      data.exercises.map((e) => ({
        id: e.id,
        title: e.name,
        summary: e.summary,
        instructions: e.instructions,
        initialHtml: e.initial_html,
        initialCss: e.initial_css,
        initialJavascript: e.initial_javascript,
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