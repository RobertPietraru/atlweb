import { adminService } from "$lib/injection";

export const load = async ({ locals, params }) => {
    const courseId = params.course_id;
    const chapterId = params.chapter_id;
    const breadcrumbs = await adminService.getBreadcrumbs(courseId ?? null, chapterId ?? null, null) ?? [];
    breadcrumbs.unshift({
        name: 'Cursuri',
        url: '/courses'
    });
    
    return {
        user: locals.user,
        canViewAdminPage: locals.user?.permissions.includes('course.view'),
        breadcrumbs: breadcrumbs
    };
};
