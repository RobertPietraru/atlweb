import { redirect } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';

export const load = async ({ locals }) => {
	if (!locals.user?.permissions.includes('course.create')) {
		redirect(302, i18n.resolveRoute('/'));
	}
};
