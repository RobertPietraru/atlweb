import { adminService } from "$lib/injection";

export const load = async ({ locals, params }) => {
    const courseId = params.id;
    const chapterId = params.chapter_id;
    const lessonId = params.lesson_id;
    const breadcrumbs = await adminService.getBreadcrumbsAdmin(courseId ?? null, chapterId ?? null, lessonId ?? null, null);

    console.log(locals.permissions);
    return {
        user: locals.user,
        permissions: locals.permissions,
        breadcrumbs: breadcrumbs ?? []
    };
};
