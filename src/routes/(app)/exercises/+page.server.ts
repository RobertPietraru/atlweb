import { adminService } from '$lib/injection';

export const load = async ({ url }) => {
    const page = Number(url.searchParams.get('page') || '1') - 1;
    const pageSize = Number(url.searchParams.get('pageSize') || '10');
    const search = url.searchParams.get('search') || '';

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