import { adminService } from '$lib/injection';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    const hasPermission = locals.user!.permissions.includes('course.view')

    if (!hasPermission) {
        redirect(302, '/');
    }

    const courses = await adminService.getCourses();
    return {
        courses
    };
};
