import { hash, verify } from '@node-rs/argon2';
import { eq, sql } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';
import { assert } from '$lib/assert';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export type SessionValidationResult = { session: null, user: null } | { session: table.Session, user: table.User };

export class AdminService {
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

    async getUserPermissions(userId: table.Id): Promise<table.Permission[]> {
        const permissions = await this.db.select({
            permission: table.user_permissions.permission,
        }).from(table.user_permissions).where(eq(table.user_permissions.user, userId));
        return permissions.map(permission => permission.permission as table.Permission);
    }

    async getUsers() {
        const users = await this.db.select({
            id: table.user.id,
            username: table.user.username,
            email: table.user.email,
        }).from(table.user);

        const usersWithPermissions = await Promise.all(users.map(async (user) => {
            const permissions = await this.db.select({
                permission: table.user_permissions.permission
            }).from(table.user_permissions).where(eq(table.user_permissions.user, user.id));

            return {
                ...user,
                permissions: permissions.map(p => p.permission)
            };
        }));
        return usersWithPermissions;
    }

    async getUser(userId: table.Id): Promise<(table.User & { permissions: table.Permission[] }) | null> {
        const user = await this.db.select({
            id: table.user.id,
            username: table.user.username,
            email: table.user.email,
        }).from(table.user).where(eq(table.user.id, userId)).limit(1);

        if (user.length === 0) {
            return null;
        }

        const permissions = await this.db.select({
            permission: table.user_permissions.permission
        }).from(table.user_permissions).where(eq(table.user_permissions.user, userId));

        const result = {
            id: user[0].id,
            username: user[0].username,
            email: user[0].email,
            permissions: permissions.map(p => p.permission as table.Permission)
        };

        return result;
    }

    async deleteUser(userId: table.Id): Promise<void> {
        await this.db.transaction(async (tx) => {
            // sessions
            await tx.delete(table.session).where(eq(table.session.userId, userId));
            // submissions
            await tx.delete(table.submission).where(eq(table.submission.userId, userId));
            // user permissions
            await tx.delete(table.user_permissions).where(eq(table.user_permissions.user, userId));
            // user
            await tx.delete(table.user).where(eq(table.user.id, userId));
        });
    }

    async hasPermission(userId: table.Id, permission: table.Permission): Promise<boolean> {
        const permissions = await this.db.select({
            permission: table.user_permissions.permission
        }).from(table.user_permissions).where(eq(table.user_permissions.user, userId));
        return permissions.some(p => p.permission === permission);
    }

    async hasPermissions(userId: table.Id, permissions: table.Permission[]): Promise<boolean> {
        const userPermissions = await this.db.select({
            permission: table.user_permissions.permission
        }).from(table.user_permissions).where(eq(table.user_permissions.user, userId));
        return permissions.every(p => userPermissions.some(up => up.permission === p));
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

    async updateUserPermissions(userId: table.Id, permissions: table.Permission[]) {
        await this.db.transaction(async (tx) => {
            await tx.delete(table.user_permissions).where(eq(table.user_permissions.user, userId));
            await tx.insert(table.user_permissions).values(permissions.map(p => ({ user: userId, permission: p })));
        });
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
            order: table.course.order,
            chapterCount: sql<number>`count(${table.chapter.id})`
        })
            .from(table.course)
            .leftJoin(table.chapter, eq(table.course.id, table.chapter.course))
            .groupBy(table.course.id)
            .orderBy(table.course.order);

        return courses;
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
            order: table.chapter.order
        }).from(table.chapter).where(eq(table.chapter.course, courseId)).orderBy(table.chapter.order);

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
        await this.db.delete(table.chapter).where(eq(table.chapter.id, id));
    }
}






