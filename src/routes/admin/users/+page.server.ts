import { adminService } from '$lib/injection';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
export const load: PageServerLoad = async () => {
    const users = await adminService.getUsers();
    return { users };
};

export const actions = {
    deleteUser: async ({ request }) => {
        const formData = await request.formData();
        const userId = formData.get('userId');

        if (!userId) {
            return fail(400, { userId, error: 'User ID is required' });
        }

        await adminService.deleteUser(userId as string);

        return { success: true };
    }

};