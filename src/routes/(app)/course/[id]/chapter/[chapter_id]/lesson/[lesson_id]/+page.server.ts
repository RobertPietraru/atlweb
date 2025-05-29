import { error } from '@sveltejs/kit';
import { adminService } from '$lib/injection';

export const load = async ({ locals, params }) => {
    const { lesson, exercises } = await adminService.getLessonWithBlocks(params.lesson_id, locals.user?.id ?? null);
    const lessonNamesInChapter = await adminService.getLessonNamesInChapter(params.chapter_id);
    const courseId = params.id;
    const chapterId = params.chapter_id;
    const lessonId = params.lesson_id;
    const breadcrumbs = await adminService.getBreadcrumbs(courseId ?? null, chapterId ?? null, lessonId ?? null) ?? [];
    breadcrumbs.unshift({
        name: 'Cursuri',
        url: '/courses'
    });

    if (!lesson) {
        error(404, 'Lesson not found');
    }

    return {
        lesson,
        exercises,
        user: locals.user,
        breadcrumbs: breadcrumbs,
        courseId: params.id,
        chapterId: params.chapter_id,
        lessonNamesInChapter
    };
};
