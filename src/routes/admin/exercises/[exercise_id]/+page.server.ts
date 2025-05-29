import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { adminService } from '$lib/injection';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user) {
        redirect(302, '/login?redirect=/exercises/');
    }
    const exercise = await adminService.getExercise(params.exercise_id);
    if (!exercise) {
        redirect(302, '/exercises/');
    }
    // if (!locals.user.permissions.includes('exercise.create')) {
    //     redirect(302, '/exercises/');
    // }

    console.log('exercise', exercise);
    return {
        exercise
    };
};

export const actions = {
    update: async ({ request, params, locals }) => {
        const formData = await request.formData();
        const html = formData.get('html')?.toString() || undefined;
        const css = formData.get('css')?.toString() || undefined;
        const javascript = formData.get('javascript')?.toString() || undefined;
        const title = formData.get('title')?.toString() || undefined;
        const summary = formData.get('summary')?.toString() || undefined;
        const instructions = formData.get('instructions')?.toString() || undefined;

        if (!locals.user) {
            return fail(400, { message: 'Nu ai permisiunea sa trimiti codul' });
        }

        const submission = await adminService.updateExercise(params.exercise_id, {
            initialHtml: html,
            initialCss: css,
            initialJavascript: javascript,
            title: title,
            summary: summary,
            instructions: instructions,
        });

        return {
            submission
        }
    },
    delete: async ({ params, locals }) => {
        if (!locals.user) {
            return fail(400, { message: 'Nu ai permisiunea sa stergi exercitiul' });
        }
        await adminService.deleteExercise(params.exercise_id);
        redirect(302, '/admin/exercises/');
    }

}