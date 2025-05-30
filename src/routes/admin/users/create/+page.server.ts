import { error, fail, redirect } from '@sveltejs/kit';
import { adminService } from '$lib/injection';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms';
import { i18n } from '$lib/i18n';
const schema = z.object({
	email: z.string().max(320, 'Email must be at most 320 characters'),
	username: z.string().max(100, 'Username must be at most 100 characters'),
	password: z.string().max(640, 'Password must be at most 640 characters')
});

export const load = async () => {
	const form = await superValidate(zod(schema));
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, username, password } = form.data;
		const result = await adminService.createUser(email, username, password);
		
		if (result === 'emailAlreadyExists') {
			setError(form, 'email', 'This email is already in use');
			return fail(400, { form });
		}
		
		if (result === 'usernameAlreadyExists') {
			setError(form, 'username', 'This username is already in use');
			return fail(400, { form });
		}

		if (result === 'unknown') {
			setError(form, 'email', 'An error occurred. Please try again.');
			return fail(400, { form });
		}

		return redirect(302, i18n.resolveRoute('/admin/users'));
	}
};
