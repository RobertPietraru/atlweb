import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, integer, primaryKey, boolean } from 'drizzle-orm/pg-core';

export const blockType = ['text', 'resources', 'code', 'exercise'] as const;
export type BlockType = typeof blockType[number];

export const permissionsList = [
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
	'course.view',

	'user.create',
	'user.edit',
	'user.delete',
	'user.view',

	'submission.solve',
] as const;
export const course = pgTable('course', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	order: integer('order').notNull(),
});

export const chapter = pgTable('chapter', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	order: integer('order').notNull(),
	course: uuid('course_id')
		.notNull()
		.references(() => course.id),
});

export const lesson = pgTable('lesson', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	teaser: text('teaser').notNull(),
	description: text('description').notNull(),
	chapterId: uuid('chapter_id')
		.notNull()
		.references(() => chapter.id),
	order: integer('order').notNull(),
});

export const lessonTextBlock = pgTable('lesson_text_block', {
	id: uuid('id').primaryKey().defaultRandom(),
	lessonId: uuid('lesson_id')
		.notNull()
		.references(() => lesson.id),
	text: text('text').notNull(),
	order: integer('order').notNull(),
});

export const lessonResourcesBlock = pgTable('lesson_resources_block', {
	id: uuid('id').primaryKey().defaultRandom(),
	lessonId: uuid('lesson_id')
		.notNull()
		.references(() => lesson.id),
	title: text('title').notNull(),
	content: text('content').notNull(),
	urls: text('urls').array().notNull(),
	urlLabels: text('url_labels').array().notNull(),
	order: integer('order').notNull(),
});

export const lessonCodeBlock = pgTable('lesson_code_block', {
	id: uuid('id').primaryKey().defaultRandom(),
	lessonId: uuid('lesson_id')
		.notNull()
		.references(() => lesson.id),
	html: text('html').notNull(),
	css: text('css').notNull(),
	javascript: text('javascript').notNull(),
	showOutput: boolean('show_output').notNull().default(false),
	order: integer('order').notNull(),
});


export const exercise = pgTable('exercise', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	creationDate: timestamp('creation_date', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	description: text('description').notNull(),
	instructions: text('instructions').notNull(),
	initialHtml: text('initial_html').notNull(),
	initialCss: text('initial_css').notNull(),
	initialJavascript: text('initial_javascript').notNull(),
	lessonId: uuid('lesson_id')
		.notNull()
		.references(() => lesson.id),
	order: integer('order').notNull(),
});

export const submission = pgTable('submission', {
	id: uuid('id').primaryKey().defaultRandom(),
	exerciseId: uuid('exercise_id')
		.notNull()
		.references(() => exercise.id),
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id),
	submissionDate: timestamp('submission_date', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	checked: boolean('checked').notNull().default(false),
	needHelp: boolean('need_help').notNull().default(false),
	anonymous: boolean('anonymous').notNull().default(false),
	javascriptCode: text('javascript_code').notNull(),
	htmlCode: text('html_code').notNull(),
	cssCode: text('css_code').notNull(),
});

// User
export const user = pgTable('user', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
});

export const user_permissions = pgTable('user_permissions', {
	id: uuid('id').primaryKey().defaultRandom(),
	user: uuid('user_id')
		.notNull()
		.references(() => user.id),
	permission: text('permission'),
});



// Session
export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

export type Session = typeof session.$inferSelect;
export type User = Omit<typeof user.$inferSelect, 'passwordHash'>;
export type Permission = typeof permissionsList[number];
export type Exercise = typeof exercise.$inferSelect;
export type Submission = typeof submission.$inferSelect;
export type Id = string;

export type LessonBlock = Omit<typeof lessonTextBlock.$inferSelect, 'lessonId'> & { type: 'text' } | Omit<typeof lessonResourcesBlock.$inferSelect, 'lessonId'> & { type: 'resources' } | Omit<typeof lessonCodeBlock.$inferSelect, 'lessonId'> & { type: 'code' } | Omit<typeof exercise.$inferSelect, 'lessonId'> & { type: 'exercise', isSolved: boolean };

export type Permissions = typeof permissionsList[number];

export function permissionToName(id: string) {
	switch (id) {
		case 'exercise.create':
			return 'Creeaza exercitii';
		case 'exercise.edit':
			return 'Editeaza exercitii';
		case 'exercise.delete':
			return 'Sterge exercitii';
		case 'exercise.view':
			return 'Vizualizeaza exercitii';

		case 'lesson.create':
			return 'Creeaza lectii';
		case 'lesson.edit':
			return 'Editeaza lectii';
		case 'lesson.delete':
			return 'Sterge lectii';
		case 'lesson.view':
			return 'Vizualizeaza lectii';

		case 'chapter.create':
			return 'Creeaza capitole';
		case 'chapter.edit':
			return 'Editeaza capitole';
		case 'chapter.delete':
			return 'Sterge capitole';
		case 'chapter.view':
			return 'Vizualizeaza capitole';
		case 'course.create':
			return 'Creeaza cursuri';
		case 'course.edit':
			return 'Editeaza cursuri';
		case 'course.delete':
			return 'Sterge cursuri';
		case 'course.view':
			return 'Vizualizeaza cursuri';

		case 'user.create':
			return 'Creeaza utilizatori';
		case 'user.edit':
			return 'Editeaza utilizatori';
		case 'user.delete':
			return 'Sterge utilizatori';
		case 'user.view':
			return 'Vizualizeaza utilizatori';
		default:
			return 'N/A';
	}
}