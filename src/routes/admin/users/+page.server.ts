import { adminService } from '$lib/injection';
import type { PageServerLoad } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';
export const load: PageServerLoad = async ({ locals }) => {
    if (!await adminService.hasPermission(locals.user!.id, 'user.view')) {
        redirect(302, '/');
    }
    const users = await adminService.getUsers();
    return { users };
};