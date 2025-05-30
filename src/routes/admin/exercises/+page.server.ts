import { adminService } from '$lib/injection';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
    const page = Number(url.searchParams.get('page') || '1') - 1;
    const pageSize = Number(url.searchParams.get('pageSize') || '10');
    const search = url.searchParams.get('search') || '';
    const hasPermission = locals.user!.permissions.includes('course.view')

    if (!hasPermission) {
        redirect(302, '/');
    }

    const { exercises, total } = await adminService.getExercises({
        page,
        pageSize,
        search: search,
    });
    const pagesLeft = Math.ceil(total / pageSize);

    return {
        exercises,
        total,
        page,
        pageSize,
        pagesLeft,
        search,
    };
};

export const actions = {
    create: async ({ request }) => {
        console.log('Creating exercise');
        const id = await adminService.createExercise({
            title: '',
            summary: '',
            instructions: '',
            initialHtml: '',
            initialCss: '',
            initialJavascript: '',
        });
        console.log(id);
        redirect(302, `/admin/exercises/${id}`);
    }
}