import { form, command, getRequestEvent } from '$app/server';
import { invalid, redirect, error } from '@sveltejs/kit';
import * as v from 'valibot';
import { adminService } from '$lib/injection';
import { permissionsList } from '$lib/server/db/schema';
import type * as table from '$lib/server/db/schema';
import { i18n } from '$lib/i18n';

export const updateUser = form(
	v.object({
		userId: v.string(),
		email: v.pipe(v.string(), v.maxLength(320, 'Email must be at most 320 characters')),
		username: v.pipe(v.string(), v.maxLength(100, 'Username must be at most 100 characters'))
	}),
	async ({ userId, email, username }, issue) => {
		const event = getRequestEvent();

		if (!event.locals.user?.permissions.includes('user.edit')) {
			error(403, 'Nu aveți permisiune să actualizați utilizatori');
		}

		const result = await adminService.updateUser(userId, { email, username });

		if (result === 'emailAlreadyExists') {
			invalid(issue.email('Această adresă de email este deja folosită'));
		}

		if (result === 'usernameAlreadyExists') {
			invalid(issue.username('Acest nume de utilizator este deja folosit'));
		}

		if (result === 'unknown') {
			invalid(issue.email('A apărut o eroare. Vă rugăm să încercați din nou.'));
		}
	}
);

export const updatePermissions = command(
	v.object({
		userId: v.string(),
		permissions: v.array(v.string())
	}),
	async ({ userId, permissions }) => {
		const event = getRequestEvent();

		if (!event.locals.user?.permissions.includes('user.edit')) {
			error(403, 'Nu aveți permisiune să actualizați utilizatori');
		}

		const validPermissions = permissions.filter((p) =>
			permissionsList.includes(p as table.Permissions)
		) as table.Permissions[];

		await adminService.updateUserPermissions(userId, validPermissions);
	}
);

export const deleteUser = command(
	v.object({ userId: v.string() }),
	async ({ userId }) => {
		const event = getRequestEvent();

		if (!event.locals.user?.permissions.includes('user.delete')) {
			error(403, 'Nu aveți permisiune să ștergeți utilizatori');
		}

		await adminService.deleteUser(userId);
		redirect(302, i18n.resolveRoute('/admin/users'));
	}
);
