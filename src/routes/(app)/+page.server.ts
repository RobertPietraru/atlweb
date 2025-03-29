import { adminService } from '$lib/injection';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
    const courses = await adminService.getCourses();
    return {
        courses
    };
};
