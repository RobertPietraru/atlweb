import { error } from '@sveltejs/kit';
import { adminService } from '$lib/injection';

export const load = async ({ locals, params }) => {
    const course = await adminService.getCourseWithChapters(params.course_id);
    if (!course) {
        error(404, 'Course not found');
    }

    return {
        course,
    };
};