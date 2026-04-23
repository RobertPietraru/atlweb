import { error, redirect } from '@sveltejs/kit';
import { adminService } from '$lib/injection';
import { permissionsList } from '$lib/server/db/schema';
import { i18n } from '$lib/i18n';

export const load = async ({ params, locals }) => {
	if (!locals.user!.permissions.includes('user.view')) {
		redirect(302, i18n.resolveRoute('/'));
	}

	const user = await adminService.getUser(params.user_id);
	if (!user) {
		throw error(404, 'User not found');
	}

	return {
		user,
		allPermissions: permissionsList
	};
};
