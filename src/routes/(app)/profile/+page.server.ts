import { adminService } from '$lib/injection';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, desc, count, and } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
    const user = locals.user!;

    const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
    const limit = 10;
    const offset = (page - 1) * limit;

    const [submissions, [totalRow], [checkedRow], [helpRow]] = await Promise.all([
        db
            .select({
                id: table.submission.id,
                submissionDate: table.submission.submissionDate,
                checked: table.submission.checked,
                needHelp: table.submission.needHelp,
                exerciseId: table.submission.exerciseId,
                exerciseTitle: table.exercise.title,
            })
            .from(table.submission)
            .innerJoin(table.exercise, eq(table.submission.exerciseId, table.exercise.id))
            .where(eq(table.submission.userId, user.id))
            .orderBy(desc(table.submission.submissionDate))
            .limit(limit)
            .offset(offset),

        db
            .select({ value: count() })
            .from(table.submission)
            .where(eq(table.submission.userId, user.id)),

        db
            .select({ value: count() })
            .from(table.submission)
            .where(and(eq(table.submission.userId, user.id), eq(table.submission.checked, true))),

        db
            .select({ value: count() })
            .from(table.submission)
            .where(and(eq(table.submission.userId, user.id), eq(table.submission.needHelp, true))),
    ]);

    const total = totalRow?.value ?? 0;
    const checked = checkedRow?.value ?? 0;
    const needHelp = helpRow?.value ?? 0;

    return {
        user,
        submissions,
        stats: {
            total,
            checked,
            pending: total - checked,
            needHelp,
        },
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

export const actions = {
    updateProfile: async ({ locals, request }) => {
        const user = locals.user!;
        const data = await request.formData();
        const username = (data.get('username') as string)?.trim();
        const email = (data.get('email') as string)?.trim();

        if (!username || !email) {
            return fail(400, { error: 'Username and email are required.' });
        }

        const result = await adminService.updateUser(user.id, { username, email });

        if (result === 'emailAlreadyExists') {
            return fail(400, { error: 'That email address is already in use.' });
        }
        if (result === 'usernameAlreadyExists') {
            return fail(400, { error: 'That username is already taken.' });
        }
        if (result === 'unknown') {
            return fail(500, { error: 'Something went wrong. Please try again.' });
        }

        return { success: true };
    }
};
