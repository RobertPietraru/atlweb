import { adminService } from '$lib/injection';

export const load = async () => {
    const courses = await adminService.getCourses();
    return {
        courses
    };
};
