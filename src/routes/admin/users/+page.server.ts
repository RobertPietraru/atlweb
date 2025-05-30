import { adminService } from '$lib/injection';
import { fail, error, redirect } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
export const load = async ({ locals }) => {
    if (!locals.user!.permissions.includes('user.view')) {
        redirect(302, i18n.resolveRoute('/'));
    }
    const users = await adminService.getUsers();
    return { users };
};