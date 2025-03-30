import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { adminService } from '$lib/injection';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user) {
        redirect(302, '/login?redirect=/course/' + params.id + '/chapter/' + params.chapter_id + '/lesson/' + params.lesson_id + '/exercise/' + params.exercise_id);
    }

    const exercise = await adminService.getExercise(params.exercise_id);
    const submissions = await adminService.getSubmissions(params.exercise_id);
    const lesson = await adminService.getLessonNameAndId(params.lesson_id);
    
    if (!exercise) {
        error(404, 'Exercise not found');
    }

    return {
        exercise,
        lesson,
        submissions,
    };
};
