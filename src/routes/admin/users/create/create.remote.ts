import { form, getRequestEvent } from '$app/server';
import { invalid, redirect, error } from '@sveltejs/kit';
import * as v from 'valibot';
import { adminService } from '$lib/injection';
import { i18n } from '$lib/i18n';

export const createUser = form(
	v.object({
		email: v.pipe(v.string(), v.maxLength(320, 'Email must be at most 320 characters')),
		username: v.pipe(v.string(), v.maxLength(100, 'Username must be at most 100 characters')),
		_password: v.pipe(v.string(), v.maxLength(640, 'Password must be at most 640 characters'))
	}),
	async ({ email, username, _password }, issue) => {
		const result = await adminService.createUser(email, username, _password);

		if (result === 'emailAlreadyExists') {
			invalid(issue.email('This email is already in use'));
		}

		if (result === 'usernameAlreadyExists') {
			invalid(issue.username('This username is already in use'));
		}

		if (result === 'unknown') {
			invalid(issue.email('An error occurred. Please try again.'));
		}

		redirect(302, i18n.resolveRoute('/admin/users'));
	}
);
