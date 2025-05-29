import { error } from '@sveltejs/kit';
import { adminService } from '$lib/injection';
import type { LessonWithBlocks } from '$lib/services/admin_service.js';

export const load = async ({ locals, params }) => {
    const hasPermission = locals.user!.permissions.includes('lesson.view')

    if (!hasPermission) {
        error(403, 'You do not have modify to view this lesson');
    }

    const { lesson, exercises } = await adminService.getLessonForEditor(params.lesson_id, null);

    if (!lesson) {
        error(404, 'Lesson not found');
    }

    return {
        lesson,
        exercises,
        courseId: params.course_id,
        chapterId: params.chapter_id,
    };
};

export const actions = {
    updateLesson: async ({ request, locals, params }) => {
        const formData = await request.formData();

        const lesson = JSON.parse(formData.get('lesson') as unknown as string) as Partial<LessonWithBlocks['lesson']>;
        if (!lesson) {
            error(400, 'Lesson is required');
        }

        await adminService.updateLesson(params.lesson_id, {
            name: lesson.name,
            teaser: lesson.teaser,
            blocks: lesson.blocks,
        });

        return { success: true };
    }
};
