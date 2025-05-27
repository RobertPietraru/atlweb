import { error, fail, redirect } from '@sveltejs/kit';
import { adminService } from '$lib/injection';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms';
import { cache } from '$lib/cache';

const schema = z.object({
	name: z.string().max(100, 'Course name must be at most 100 characters'),
	description: z.string().max(1000, 'Description must be at most 1000 characters')
});

export const load = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	const hasPermission = locals.user!.permissions.includes('course.create')


	if (!hasPermission) {
		redirect(302, '/');
	}

	const form = await superValidate(zod(schema));
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { name, description } = form.data;
		const result = await adminService.createCourse(name, description);
        cache.courses = null;
		
		if (result === 'nameAlreadyExists') {
			setError(form, 'name', 'A course with this name already exists');
			return fail(400, { form });
		}

		if (result === 'unknown') {
			setError(form, 'name', 'An error occurred. Please try again.');
			return fail(400, { form });
		}

		return redirect(302, '/admin/courses');
	}
};
