import { adminService } from '$lib/injection';
import { redirect } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';

export const load = async ({ locals }) => {
    const hasPermission = locals.user!.permissions.includes('course.view')

    if (!hasPermission) {
        redirect(302, i18n.resolveRoute('/'));
    }

    const courses = await adminService.getCourses();
    return {
        courses
    };
};
