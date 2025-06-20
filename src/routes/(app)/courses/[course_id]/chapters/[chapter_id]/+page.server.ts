import { error } from '@sveltejs/kit';
import { adminService } from '$lib/injection';


export const load = async ({ locals, params }) => {
    const chapter = await adminService.getChapterWithLessons(params.chapter_id);
    if (!chapter) {
        error(404, 'Chapter not found');
    }

    return {
        chapter,
        courseId: params.course_id,
    };
};
