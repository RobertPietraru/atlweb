import { hash } from '@node-rs/argon2';
import { eq, sql, and, desc, asc, arrayContains, inArray } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';
import { assert } from '$lib/assert';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class AdminService {
    async updateChapter(chapter_id: table.Id, params: { name: string, description: string }) {
        await this.db.update(table.chapter).set({
            name: params.name,
            description: params.description
        }).where(eq(table.chapter.id, chapter_id));
    }

    private db: PostgresJsDatabase;
    constructor(db: PostgresJsDatabase) {
        this.db = db;
    }

    async createUser(email: string, username: string, password: string): Promise<table.Id | 'unknown' | 'emailAlreadyExists' | 'usernameAlreadyExists'> {
        /// if the password is too long, throw an error
        assert(password.length < 400, 'Password too long');
        assert(username.length < 100, 'Username too long');
        assert(email.length < 100, 'Email too long');
        assert(username.length > 0, 'Username too short');
        assert(email.length > 0, 'Email too short');
        assert(password.length >= 8, 'Password too short');
        assert(email.includes('@'), 'Email must contain an @');
        const passwordHash = await hash(password, {
            // recommended minimum parameters
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });
        /// check if email already exists
        const existingUser = await this.db.select().from(table.user).where(eq(table.user.email, email));
        if (existingUser.length > 0) {
            return 'emailAlreadyExists';
        }
        /// check if username already exists
        const existingUsername = await this.db.select().from(table.user).where(eq(table.user.username, username));
        if (existingUsername.length > 0) {
            return 'usernameAlreadyExists';
        }

        const [result] = await this.db
            .insert(table.user)
            .values({ email, username, passwordHash })
            .returning({ id: table.user.id });

        return result.id;
    }

    async getUsers() {
        const users = await this.db.select({
            id: table.user.id,
            username: table.user.username,
            permissions: table.user.permissions,
            email: table.user.email,
        }).from(table.user);

        return users;
    }

    async getUser(userId: table.Id): Promise<table.User | null> {
        const users = await this.db.select({
            id: table.user.id,
            username: table.user.username,
            email: table.user.email,
            permissions: table.user.permissions,
        }).from(table.user).where(eq(table.user.id, userId)).limit(1);

        if (users.length === 0) {
            return null;
        }

        return users[0];
    }

    async deleteUser(userId: table.Id): Promise<void> {
        await this.db.transaction(async (tx) => {
            // sessions
            await tx.delete(table.session).where(eq(table.session.userId, userId));
            // submissions
            await tx.delete(table.submission).where(eq(table.submission.userId, userId));
            // user
            await tx.delete(table.user).where(eq(table.user.id, userId));
        });
    }

    async updateUser(userId: table.Id, { email, username }: { email: string, username: string }): Promise<table.Id | 'unknown' | 'emailAlreadyExists' | 'usernameAlreadyExists'> {
        const oldUsers = await this.db.select().from(table.user).where(eq(table.user.id, userId)).limit(1);
        if (oldUsers.length === 0) {
            return 'unknown';
        }
        const oldUser = oldUsers[0];
        if (oldUser.email === email && oldUser.username === username) {
            return userId;
        }

        if (oldUser.email !== email) {
            const existingEmail = await this.db.select().from(table.user).where(eq(table.user.email, email));
            if (existingEmail.length > 0) {
                return 'emailAlreadyExists';
            }
        }

        if (oldUser.username !== username) {
            const existingUsername = await this.db.select().from(table.user).where(eq(table.user.username, username));
            if (existingUsername.length > 0) {
                return 'usernameAlreadyExists';
            }
        }

        await this.db.update(table.user).set({ email, username }).where(eq(table.user.id, userId));
        return userId;
    }

    async updateUserPermissions(userId: table.Id, permissions: string[]) {
        this.db.update(table.user).set({
            permissions: permissions
        }).where(eq(table.user.id, userId));
    }

    async createCourse(name: string, description: string): Promise<table.Id> {
        const [course] = await this.db.insert(table.course).values({
            name,
            description,
            order: 0
        }).returning({ id: table.course.id });
        return course.id;
    }

    async getCourses() {
        const courses = await this.db.select({
            id: table.course.id,
            name: table.course.name,
            description: table.course.description,
            order: table.course.order,
            chapterCount: sql<number>`count(${table.chapter.id})`
        })
            .from(table.course)
            .leftJoin(table.chapter, eq(table.course.id, table.chapter.course))
            .groupBy(table.course.id)
            .orderBy(table.course.order);

        return courses;
    }

    async getChapterWithLessons(chapterId: table.Id) {
        const chapter = await this.db.select({
            id: table.chapter.id,
            name: table.chapter.name,
            order: table.chapter.order,
            description: table.chapter.description,
        }).from(table.chapter).where(eq(table.chapter.id, chapterId)).limit(1);
        if (chapter.length === 0) {
            return null;
        }
        const lessons = await this.db.select({
            id: table.lesson.id,
            name: table.lesson.name,
            teaser: table.lesson.teaser,
            order: table.lesson.order
        }).from(table.lesson).where(eq(table.lesson.chapterId, chapterId)).orderBy(table.lesson.order);
        return {
            ...chapter[0],
            lessons
        };
    }

    async getCourseWithChapters(courseId: table.Id) {
        const course = await this.db.select({
            id: table.course.id,
            name: table.course.name,
            description: table.course.description,
            order: table.course.order,
        }).from(table.course).where(eq(table.course.id, courseId)).limit(1);
        if (course.length === 0) {
            return null;
        }
        const chapters = await this.db.select({
            id: table.chapter.id,
            name: table.chapter.name,
            order: table.chapter.order,
            description: table.chapter.description,
            lessonCount: sql<number>`count(${table.lesson.id})`
        })
            .from(table.chapter)
            .leftJoin(table.lesson, eq(table.chapter.id, table.lesson.chapterId))
            .where(eq(table.chapter.course, courseId))
            .groupBy(table.chapter.id)
            .orderBy(table.chapter.order);

        return {
            ...course[0],
            chapters
        };
    }

    async createChapter(courseId: table.Id, data: { name: string; description: string }) {
        const [course] = await this.db.select({
            chapterCount: sql<number>`count(${table.chapter.id})`
        })
            .from(table.course)
            .leftJoin(table.chapter, eq(table.course.id, table.chapter.course))
            .where(eq(table.course.id, courseId))
            .groupBy(table.course.id)
            .limit(1);

        const [chapter] = await this.db.insert(table.chapter).values({
            name: data.name,
            description: data.description,
            course: courseId,
            order: course.chapterCount
        }).returning({ id: table.chapter.id });
        return chapter.id;
    }

    async createLesson(chapterId: table.Id) {
        const lessonCount = await this.db.select({
            lessonCount: sql<number>`count(${table.lesson.id})`
        }).from(table.lesson).where(eq(table.lesson.chapterId, chapterId));
        if (lessonCount.length === 0) {
            return null;
        }
        const index = lessonCount[0].lessonCount;
        const [lesson] = await this.db.insert(table.lesson).values({
            name: '',
            chapterId,
            description: '',
            teaser: '',
            order: index,
        }).returning({ id: table.lesson.id });
        return lesson.id;
    }

    async reorderAllChapters(chapters: string[]) {
        await this.db.transaction(async (tx) => {
            for (let i = 0; i < chapters.length; i++) {
                await tx.update(table.chapter)
                    .set({ order: i + 1 })
                    .where(eq(table.chapter.id, chapters[i]));
            }
        });
    }

    async deleteChapter(id: string) {
        const lessons = await this.db.select({
            id: table.lesson.id
        }).from(table.lesson).where(eq(table.lesson.chapterId, id));
        for (const lesson of lessons) {
            await this.deleteLesson(lesson.id);
        }
        await this.db.delete(table.chapter).where(eq(table.chapter.id, id));
    }

    async reorderAllLessons(lessons: string[]) {
        await this.db.transaction(async (tx) => {
            for (let i = 0; i < lessons.length; i++) {
                await tx.update(table.lesson)
                    .set({ order: i })
                    .where(eq(table.lesson.id, lessons[i]));
            }
        });
    }
    async deleteLesson(id: table.Id) {
        await this.db.delete(table.lesson).where(eq(table.lesson.id, id));
    }
    async getPreviousAndNextLesson(lesson_id: table.Id) {
        const lesson = await this.db.select({
            id: table.lesson.id,
            order: table.lesson.order,
            chapterId: table.lesson.chapterId
        }).from(table.lesson).where(eq(table.lesson.id, lesson_id)).limit(1);
        if (lesson.length === 0) {
            return null;
        }
        const lessonCount = await this.db.select({
            lessonCount: sql<number>`count(${table.lesson.id})`
        }).from(table.lesson).where(eq(table.lesson.chapterId, lesson[0].chapterId));
        if (lessonCount.length === 0) {
            return null;
        }
        let previousLesson = null;
        let nextLesson = null;
        if (lesson[0].order > 0) {
            previousLesson = await this.db.select({
                id: table.lesson.id,
                name: table.lesson.name,
            }).from(table.lesson).where(and(eq(table.lesson.chapterId, lesson[0].chapterId), eq(table.lesson.order, lesson[0].order - 1))).limit(1);
        }
        if (lesson[0].order < lessonCount[0].lessonCount - 1) {
            nextLesson = await this.db.select({
                id: table.lesson.id,
                name: table.lesson.name,
            }).from(table.lesson).where(and(eq(table.lesson.chapterId, lesson[0].chapterId), eq(table.lesson.order, lesson[0].order + 1))).limit(1);
        }
        return {
            previous: previousLesson ? previousLesson[0] : null,
            next: nextLesson ? nextLesson[0] : null
        };
    }
    async getLessonWithBlocks(lesson_id: table.Id, userId: table.Id | null) {
        let lesson = await this.db.select({
            id: table.lesson.id,
            name: table.lesson.name,
            teaser: table.lesson.teaser,
            description: table.lesson.description,
            blocks: table.lesson.blocks,
        }).from(table.lesson).where(eq(table.lesson.id, lesson_id)).limit(1);

        if (lesson.length === 0) {
            return null;
        }

        const exercises = await this.db.select({
            id: table.exercise.id,
            name: table.exercise.name,
            description: table.exercise.description,
            hasSubmission: table.submission.id,
        }).from(table.exercise)
            .leftJoin(table.submission, and(eq(table.exercise.id, table.submission.exerciseId), userId ? eq(table.submission.userId, userId) : undefined));

        return {
            lesson: {
                ...lesson[0],
                blocks: lesson[0].blocks.filter(block => block.type !== 'exercise' || exercises.find(exercise => exercise.id === block.exerciseId)),
            },
            exercises: exercises.map(exercise => ({
                ...exercise,
                hasSubmission: Boolean(exercise.hasSubmission),
            }))
        };
    }
    async getLessonForEditor(lesson_id: table.Id, userId: table.Id | null) {
        let lesson = await this.db.select({
            id: table.lesson.id,
            name: table.lesson.name,
            teaser: table.lesson.teaser,
            description: table.lesson.description,
            blocks: table.lesson.blocks,
        }).from(table.lesson).where(eq(table.lesson.id, lesson_id)).limit(1);

        if (lesson.length === 0) {
            return {
                lesson: null,
                exercises: []
            };
        }
        const exerciseIds = lesson[0].blocks.filter(block => block.type === 'exercise').map(block => block.exerciseId);

        const exercises = await this.db.select({
            id: table.exercise.id,
            name: table.exercise.name,
            description: table.exercise.description,
            hasSubmission: table.submission.id,
        }).from(table.exercise).where(inArray(table.exercise.id, exerciseIds))
            .leftJoin(table.submission, and(eq(table.exercise.id, table.submission.exerciseId), userId ? eq(table.submission.userId, userId) : undefined));

        return {
            lesson: {
                ...lesson[0],
                blocks: lesson[0].blocks.filter(block => block.type !== 'exercise' || exercises.find(exercise => exercise.id === block.exerciseId)),
            },
            exercises: exercises.map(exercise => ({
                ...exercise,
                hasSubmission: Boolean(exercise.hasSubmission),
            }))
        };
    }

    async getLessonNamesInChapter(chapter_id: table.Id) {
        return await this.db.select({
            name: table.lesson.name,
            id: table.lesson.id,
        }).from(table.lesson).where(eq(table.lesson.chapterId, chapter_id)).orderBy(table.lesson.order);
    }
    async updateLesson(lesson_id: table.Id, params: { name?: string, teaser?: string, description?: string, blocks?: table.LessonBlock[] }) {
        await this.db.update(table.lesson).set({
            name: params.name,
            teaser: params.teaser,
            description: params.description,
            blocks: params.blocks,
        }).where(eq(table.lesson.id, lesson_id));
    }


    async getExercise(exercise_id: table.Id) {
        const exercise = await this.db.select().from(table.exercise).where(eq(table.exercise.id, exercise_id)).limit(1);
        if (exercise.length === 0) {
            return null;
        }
        return exercise[0];
    }

    async getLessonNameAndId(lesson_id: table.Id) {
        const lesson = await this.db.select({
            name: table.lesson.name,
            id: table.lesson.id,
        }).from(table.lesson).where(eq(table.lesson.id, lesson_id)).limit(1);
        if (lesson.length === 0) {
            return null;
        }
        return lesson[0];
    }

    async getSubmissions(exercise_id: table.Id) {
        return await this.db.select().from(table.submission).where(eq(table.submission.exerciseId, exercise_id)).orderBy(desc(table.submission.submissionDate));
    }

    async getSubmissionsToCheck(exercise_id: table.Id) {
        const list = await this.db
            .select({
                submission: table.submission,
                username: table.user.username,
            })
            .from(table.submission)
            .leftJoin(table.user, eq(table.submission.userId, table.user.id))
            .where(
                and(
                    eq(table.submission.exerciseId, exercise_id),
                    eq(table.submission.checked, false),
                    eq(table.submission.needHelp, true)
                )
            )
            .orderBy(asc(table.submission.submissionDate))
            .limit(5);

        return list.map(item => ({
            ...item.submission,
            username: item.username,
        }));
    }

    async createSubmission(exerciseId: table.Id, userId: table.Id, params: {
        html: string,
        css: string,
        javascript: string,
        needHelp: boolean,
    }) {
        const [submission] = await this.db.insert(table.submission).values({
            exerciseId,
            userId,
            checked: false,
            htmlCode: params.html,
            cssCode: params.css,
            javascriptCode: params.javascript,
            needHelp: params.needHelp,
        }).returning();
        return submission;
    }

    async deleteSubmission(submissionId: table.Id) {
        await this.db.delete(table.submission).where(eq(table.submission.id, submissionId));
    }
    async getBreadcrumbs(courseId: table.Id | null, chapterId: table.Id | null, lessonId: table.Id | null, exerciseId: table.Id | null) {
        const breadcrumbs: { name: string, url: string }[] = [];
        if (courseId) {
            const name = await this.db.select({
                name: table.course.name,
            }).from(table.course).where(eq(table.course.id, courseId)).limit(1);
            if (name.length === 0) {
                return null;
            }
            breadcrumbs.push({
                name: name[0].name,
                url: `/course/${courseId}`,
            });
        } else {
            return breadcrumbs;
        }
        if (chapterId) {
            const name = await this.db.select({
                name: table.chapter.name,
            }).from(table.chapter).where(eq(table.chapter.id, chapterId)).limit(1);
            if (name.length === 0) {
                return null;
            }
            breadcrumbs.push({
                name: name[0].name,
                url: `/course/${courseId}/chapter/${chapterId}`,
            });
        } else {
            return breadcrumbs;
        }
        if (lessonId) {
            const name = await this.db.select({
                name: table.lesson.name,
            }).from(table.lesson).where(eq(table.lesson.id, lessonId)).limit(1);
            if (name.length === 0) {
                return null;
            }
            breadcrumbs.push({
                name: name[0].name,
                url: `/course/${courseId}/chapter/${chapterId}/lesson/${lessonId}`,
            });
        } else {
            return breadcrumbs;
        }
        if (exerciseId) {
            const name = await this.db.select({
                name: table.exercise.name,
            }).from(table.exercise).where(eq(table.exercise.id, exerciseId)).limit(1);
            if (name.length === 0) {
                return null;
            }
            breadcrumbs.push({
                name: name[0].name,
                url: `/course/${courseId}/chapter/${chapterId}/lesson/${lessonId}/exercise/${exerciseId}`,
            });
        }
        return breadcrumbs;
    }

    async markSubmissionAsChecked(submissionId: table.Id, params: {
        html: string,
        css: string,
        javascript: string,
    }) {
        await this.db.update(table.submission).set({
            htmlCode: params.html,
            cssCode: params.css,
            javascriptCode: params.javascript,
            checked: true,
        }).where(eq(table.submission.id, submissionId));
    }

    async updateCourse(id: table.Id, params: { name: string, description: string }) {
        await this.db.update(table.course).set({
            name: params.name,
            description: params.description,
        }).where(eq(table.course.id, id));
    }
}




export type LessonWithBlocks = NonNullable<Awaited<ReturnType<AdminService['getLessonWithBlocks']>>>;
