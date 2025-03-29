import { error } from '@sveltejs/kit';
import { adminService } from '$lib/injection';
import type { LessonWithBlocks } from '$lib/services/admin_service.js';

export const load = async ({ locals, params }) => {
    const lesson = await adminService.getLessonWithBlocks(params.lesson_id);
    const lessonNamesInChapter = await adminService.getLessonNamesInChapter(params.chapter_id);

    if (!lesson) {
        error(404, 'Lesson not found');
    }

    return {
        lesson,
        courseId: params.id,
        chapterId: params.chapter_id,
        lessonNamesInChapter
    };
};
