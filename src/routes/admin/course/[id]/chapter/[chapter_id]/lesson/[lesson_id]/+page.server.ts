import { error } from '@sveltejs/kit';
import { adminService } from '$lib/injection';
import type { LessonWithBlocks } from '$lib/services/admin_service.js';

export const load = async ({ locals, params }) => {
    const hasPermission = locals.user!.permissions.includes('lesson.view')

    if (!hasPermission) {
        error(403, 'You do not have modify to view this lesson');
    }

    const lesson = await adminService.getLessonWithBlocks(params.lesson_id, null);

    if (!lesson) {
        error(404, 'Lesson not found');
    }

    return {
        lesson,
        courseId: params.id,
        chapterId: params.chapter_id,
    };
};

export const actions = {
    updateLesson: async ({ request, locals, params }) => {
        const formData = await request.formData();

        const lesson = JSON.parse(formData.get('lesson') as unknown as string) as LessonWithBlocks;

        await adminService.updateLesson(params.lesson_id, {
            name: lesson.name,
            teaser: lesson.teaser,
            description: lesson.description,
        });

        const modifiedLesson = await adminService.getLessonWithBlocks(params.lesson_id, null);

        return { success: true, lesson: modifiedLesson };
    }
};
