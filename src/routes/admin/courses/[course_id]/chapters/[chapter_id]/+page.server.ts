import { error, redirect } from '@sveltejs/kit';
import { adminService } from '$lib/injection';
import { i18n } from '$lib/i18n';

export const load = async ({ locals, params }) => {
	if (!locals.user) {
		redirect(302, i18n.resolveRoute('/login'));
	}

	if (!locals.user.permissions.includes('chapter.view')) {
		redirect(302, i18n.resolveRoute('/'));
	}

	const chapter = await adminService.getChapterWithLessons(params.chapter_id);
	if (!chapter) {
		error(404, 'Chapter not found');
	}

	return {
		chapter,
		courseId: params.course_id
	};
};
