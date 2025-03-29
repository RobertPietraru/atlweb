import { error, redirect } from '@sveltejs/kit';
import { adminService } from '$lib/injection';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms';


export const load = async ({ locals, params }) => {
    const chapter = await adminService.getChapterPreview(params.chapter_id);
    if (!chapter) {
        error(404, 'Chapter not found');
    }

    return {
        chapter,
        courseId: params.id
    };
};
