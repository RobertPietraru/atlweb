import { form, getRequestEvent } from '$app/server';
import { invalid, redirect, error } from '@sveltejs/kit';
import * as v from 'valibot';
import { adminService } from '$lib/injection';
import { i18n } from '$lib/i18n';

export const createCourse = form(
	v.object({
		name: v.pipe(v.string(), v.maxLength(100, 'Course name must be at most 100 characters')),
		description: v.pipe(v.string(), v.maxLength(1000, 'Description must be at most 1000 characters'))
	}),
	async ({ name, description }, issue) => {
		const event = getRequestEvent();

		if (!event.locals.user?.permissions.includes('course.create')) {
			error(403, 'You do not have permission to create courses');
		}

		const result = await adminService.createCourse(name, description);

		if (result === 'nameAlreadyExists') {
			invalid(issue.name('A course with this name already exists'));
		}

		if (result === 'unknown') {
			invalid(issue.name('An error occurred. Please try again.'));
		}

		redirect(302, i18n.resolveRoute('/admin/courses'));
	}
);
