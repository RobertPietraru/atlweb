import { hash, verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
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

    async getUser(userId: table.Id): Promise<table.User | null> {
        const user = await this.db.select({
            id: table.user.id,
            username: table.user.username,
            email: table.user.email,
        }).from(table.user).where(eq(table.user.id, userId));
        return user.at(0) ?? null;
    }

    async deleteUser(userId: table.Id): Promise<void> {
        await this.db.transaction(async (tx) => {
            await tx.delete(table.user_permissions).where(eq(table.user_permissions.user, userId));
            await tx.delete(table.user).where(eq(table.user.id, userId));
        });
    }
}






