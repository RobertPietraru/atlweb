import { adminService } from "$lib/injection";

export const load = async ({ locals, params }) => {
    const courseId = params.id;
    const chapterId = params.chapter_id;
    const lessonId = params.lesson_id;
    const breadcrumbs = await adminService.getBreadcrumbsAdmin(courseId ?? null, chapterId ?? null, lessonId ?? null, null) ?? [];
    breadcrumbs.unshift({
        name: 'Panou de administrator',
        url: '/admin'
    });
    return {
        user: locals.user,
        canViewAdminPage: locals.user?.permissions.includes('course.view'),
        breadcrumbs: breadcrumbs
    };
};
