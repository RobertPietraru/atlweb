import { error } from '@sveltejs/kit';
import { adminService } from '$lib/injection';

export const load = async ({ locals, params }) => {
	if (!locals.user!.permissions.includes('course.view')) {
		error(403, 'You do not have permission to view this course');
	}

	const course = await adminService.getCourseWithChapters(params.course_id);
	if (!course) {
		error(404, 'Course not found');
	}

	return { course };
};
