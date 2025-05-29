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

    return {
        exercise
    };
};

export const actions= {
    create: async ({ request, params ,locals}) => {
        const formData = await request.formData();
        const html = formData.get('html') ?? '';
        const css = formData.get('css') ?? '';
        const javascript = formData.get('javascript') ?? '';
        const name = formData.get('name') ?? '';
        const summary = formData.get('summary') ?? '';
        const instructions = formData.get('instructions') ?? '';
        if (!html && !css && !javascript ) {
            return fail(400, { message: 'Nu ai trimis codul' });
        }

        if (!locals.user) {
            return fail(400, { message: 'Nu ai permisiunea sa trimiti codul' });
        }

        const submission = await adminService.createExercise({
            initialHtml: html as string,
            initialCss: css as string,
            initialJavascript: javascript as string,
            title: name as string,
            summary: summary as string,
            instructions: instructions as string,
        });

        return {
            submission
        }
    },

}