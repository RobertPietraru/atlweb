import { adminService } from '$lib/injection';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
    const page = Number(url.searchParams.get('page') || '1') - 1;
    const pageSize = Number(url.searchParams.get('pageSize') || '10');
    const hasPermission = locals.user!.permissions.includes('course.view')

    if (!hasPermission) {
        redirect(302, '/');
    }

    const {exercises, total} = await adminService.getExercises({
        page,
        pageSize,
    });
    const pagesLeft = Math.ceil(total / pageSize);

    return {
        exercises,
        total,
        pagesLeft,
    };
};
