import { cache } from '$lib/cache';
import { adminService } from '$lib/injection';

export const load = async () => {
    const start = new Date();

    if (!cache.courses){
        cache.courses = await adminService.getCourses();
    }
    const end = new Date();
    console.log("Courses load time: " ,Number(end) - Number(start));
    return {
        courses: cache.courses!
    };
};
