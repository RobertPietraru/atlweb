import { command, getRequestEvent } from '$app/server';
import { redirect, error } from '@sveltejs/kit';
import * as v from 'valibot';
import { adminService } from '$lib/injection';
import { i18n } from '$lib/i18n';

export const createLesson = command(
	v.object({ courseId: v.string(), chapterId: v.string() }),
	async ({ courseId, chapterId }) => {
		const event = getRequestEvent();

		if (!event.locals.user?.permissions.includes('lesson.edit') || !event.locals.user.permissions.includes('lesson.create')) {
			error(403, 'Nu ai permisiune să creezi lecții');
		}

		const lessonId = await adminService.createLesson(chapterId);
		redirect(302, i18n.resolveRoute(`/admin/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`));
	}
);

export const updateChapter = command(
	v.object({
		chapterId: v.string(),
		name: v.string(),
		description: v.string()
	}),
	async ({ chapterId, name, description }) => {
		const event = getRequestEvent();

		if (!event.locals.user?.permissions.includes('course.edit')) {
			error(403, 'You do not have permission to edit this chapter');
		}

		await adminService.updateChapter(chapterId, { name, description });
	}
);

export const manageLessons = command(
	v.object({
		chapterId: v.string(),
		lessons: v.array(v.string())
	}),
	async ({ chapterId, lessons }) => {
		const event = getRequestEvent();

		if (!event.locals.user?.permissions.includes('lesson.edit')) {
			error(403, 'Forbidden');
		}

		const chapter = await adminService.getChapterWithLessons(chapterId);
		if (!chapter) {
			error(404, 'Chapter not found');
		}

		for (const lesson of chapter.lessons) {
			if (!lessons.includes(lesson.id)) {
				await adminService.deleteLesson(lesson.id);
			}
		}

		await adminService.reorderAllLessons(lessons);
	}
);
