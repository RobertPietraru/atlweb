import { adminService } from "$lib/injection";

export const load = async ({ locals, params }) => {
    const courseId = params.id;
    const chapterId = params.chapter_id;
    const lessonId = params.lesson_id;
    const exerciseId = params.exercise_id;
    const start = new Date();
    const breadcrumbs = await adminService.getBreadcrumbs(courseId ?? null, chapterId ?? null, lessonId ?? null, exerciseId ?? null) ?? [];
    const end = new Date();
    console.log("Breadcrumbs time: ", Number(end) - Number(start));
    breadcrumbs.unshift({
        name: 'Cursuri',
        url: '/courses'
    });
    return {
        user: locals.user,
        canViewAdminPage: locals.permissions.includes('course.view'),
        breadcrumbs: breadcrumbs
    };
};
