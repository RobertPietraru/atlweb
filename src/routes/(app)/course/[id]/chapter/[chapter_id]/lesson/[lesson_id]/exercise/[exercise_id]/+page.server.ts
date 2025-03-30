import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { adminService } from '$lib/injection';

export const load: PageServerLoad = async ({ params }) => {
    const exercise = await adminService.getExercise(params.exercise_id);
    
    if (!exercise) {
        error(404, 'Exercise not found');
    }

    return {
        exercise
    };
};
