import { command, getRequestEvent } from '$app/server';
import { redirect, error } from '@sveltejs/kit';
import * as v from 'valibot';
import { adminService } from '$lib/injection';
import { i18n } from '$lib/i18n';

export const createChapter = command(
	v.object({ courseId: v.string() }),
	async ({ courseId }) => {
		const event = getRequestEvent();

		if (!event.locals.user) {
			redirect(302, i18n.resolveRoute('/login'));
		}

		if (!event.locals.user.permissions.includes('course.edit') || !event.locals.user.permissions.includes('course.create')) {
			error(403, 'Nu ai permisiunea să creezi un capitol');
		}

		const id = await adminService.createChapter(courseId, {
			name: 'Capitol nou',
			description: 'Descrierea capitolului'
		});

		redirect(302, i18n.resolveRoute(`/admin/courses/${courseId}/chapters/${id}`));
	}
);

export const updateCourse = command(
	v.object({
		courseId: v.string(),
		name: v.string(),
		description: v.string()
	}),
	async ({ courseId, name, description }) => {
		const event = getRequestEvent();

		if (!event.locals.user?.permissions.includes('course.edit')) {
			error(403, 'Nu ai permisiunea să editezi acest curs');
		}

		await adminService.updateCourse(courseId, { name, description });
	}
);

export const manageChapters = command(
	v.object({
		courseId: v.string(),
		chapters: v.array(v.string())
	}),
	async ({ courseId, chapters }) => {
		const event = getRequestEvent();

		if (!event.locals.user?.permissions.includes('course.edit')) {
			error(403, 'Forbidden');
		}

		const course = await adminService.getCourseWithChapters(courseId);
		if (!course) {
			error(404, 'Course not found');
		}

		for (const chapter of course.chapters) {
			if (!chapters.includes(chapter.id)) {
				await adminService.deleteChapter(chapter.id);
			}
		}

		await adminService.reorderAllChapters(chapters);
	}
);
