import { error } from '@sveltejs/kit';
import { adminService } from '$lib/injection';

export const load = async ({ locals, params }) => {
    const lesson = await adminService.getLessonWithBlocks(params.lesson_id, locals.user?.id ?? null);
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
