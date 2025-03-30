import { error, fail, redirect } from '@sveltejs/kit';
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

export const actions= {
    submit: async ({ request, params ,locals}) => {
        const formData = await request.formData();
        const html = formData.get('html') ?? '';
        const css = formData.get('css') ?? '';
        const javascript = formData.get('javascript') ?? '';
        const exerciseId = params.exercise_id;
        if (!html && !css && !javascript ) {
            return fail(400, { message: 'Nu ai trimis codul' });
        }

        if (!locals.user) {
            return fail(400, { message: 'Nu ai permisiunea sa trimiti codul' });
        }

        const submission = await adminService.createSubmission(exerciseId, locals.user.id, {
            html: html as string,
            css: css as string,
            javascript: javascript as string,
        });

        return {
            success: true,
            submission
        }
    }
}