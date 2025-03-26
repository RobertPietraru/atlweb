import { hash, verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';
import type { RequestEvent } from '@sveltejs/kit';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { assert } from '$lib/assert';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
export type SessionValidationResult = { session: null, user: null } | { session: table.Session, user: table.User };

export class AuthService {
    private db: PostgresJsDatabase;
    public sessionCookieName: string;
    constructor(db: PostgresJsDatabase) {
        this.db = db;
        this.sessionCookieName = 'auth-session';
    }

    async createAccount(email: string, username: string, password: string): Promise<table.Id | 'unknown' | 'emailAlreadyExists' | 'usernameAlreadyExists'> {
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

    async login(email: string, password: string): Promise<table.Id | 'wrongCredentials'> {
        assert(email.length < 100, 'Email too long');
        assert(password.length < 400, 'Password too long');
        const results = await this.db.select().from(table.user).where(eq(table.user.email, email));

        const existingUser = results.at(0);

        if (!existingUser) {
            return 'wrongCredentials';
        }

        const validPassword = await verify(existingUser.passwordHash, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });
        if (!validPassword) {
            return 'wrongCredentials';
        }
        return existingUser.id;
    }

    async invalidateSession(sessionId: string): Promise<boolean> {
        try {
            await this.db.delete(table.session).where(eq(table.session.id, sessionId));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async generateSessionToken() {
        const bytes = crypto.getRandomValues(new Uint8Array(18));
        const token = encodeBase64url(bytes);
        return token;
    }

    async createSession(token: string, userId: table.Id) {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        const session: table.Session = {
            id: sessionId,
            userId,
            expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
        };
        await this.db.insert(table.session).values(session);
        return session;
    }

    async getUserPermissions(userId: table.Id)  : Promise<table.Permission[]> {
        const permissions = await this.db.select({
            permission: table.user_permissions.permission,
        }).from(table.user_permissions).where(eq(table.user_permissions.user, userId));
        return permissions.map(permission => permission.permission as table.Permission);
    }

    async validateSessionToken(token: string): Promise<SessionValidationResult> {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        /// get user and role and session
        const [result] = await this.db
            .select({
                user: { id: table.user.id, username: table.user.username, email: table.user.email },
                session: table.session,
            })
            .from(table.session)
            .innerJoin(table.user, eq(table.session.userId, table.user.id))
            .where(eq(table.session.id, sessionId));

        if (!result) {
            return { session: null, user: null };
        }
        const { session, user } = result;

        const sessionExpired = Date.now() >= session.expiresAt.getTime();
        if (sessionExpired) {
            await this.db.delete(table.session).where(eq(table.session.id, session.id));
            return { session: null, user: null, };
        }

        const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
        if (renewSession) {
            session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
            await this.db
                .update(table.session)
                .set({ expiresAt: session.expiresAt })
                .where(eq(table.session.id, session.id));
        }

        return { session, user };
    }

    setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
        event.cookies.set(this.sessionCookieName, token, {
            expires: expiresAt,
            path: '/'
        });
    }

    deleteSessionTokenCookie(event: RequestEvent) {
        event.cookies.delete(this.sessionCookieName, {
            path: '/'
        });
    }
}








