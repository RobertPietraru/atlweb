import { adminService } from "$lib/injection";

export const load = async ({ locals, params }) => {
    const courseId = params.id;
    const chapterId = params.chapter_id;
    const lessonId = params.lesson_id;
    const exerciseId = params.exercise_id;
    const breadcrumbs = await adminService.getBreadcrumbs(courseId ?? null, chapterId ?? null, lessonId ?? null, exerciseId ?? null);

    return {
        user: locals.user,
        breadcrumbs: breadcrumbs ?? []
    };
};
