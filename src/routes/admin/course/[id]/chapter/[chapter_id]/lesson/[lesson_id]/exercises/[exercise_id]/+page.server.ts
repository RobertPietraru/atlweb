import { adminService } from "$lib/injection";
import { error } from "@sveltejs/kit";

export const load = async ({ params }) => {
    const exercise = await adminService.getExercise(params.exercise_id);
    if (!exercise) {
        error(404, 'Exercise not found');
    }
    return {
        exercise
    };
};

