import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { adminService } from '$lib/injection';
import { i18n } from '$lib/i18n';
export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user) {
        redirect(302, i18n.resolveRoute('/login?redirect=/exercises/' + params.exercise_id));
    }

    const exercise = await adminService.getExercise(params.exercise_id);
    const submissions = await adminService.getSubmissions(params.exercise_id);
    
    const isHelper = locals.user!.permissions.includes('submission.solve');
    if (!exercise) {
        error(404, 'Exercise not found');
    }

    return {
        isHelper,
        exercise,
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
        const needHelp = formData.get('needHelp') ?? 'false';
        if (!html && !css && !javascript ) {
            return fail(400, { message: 'Nu ai trimis codul' });
        }

        if (!locals.user) {
            return fail(400, { message: 'Nu ai permisiunea sa trimiti codul' });
        }

        const submission = await adminService.createSubmission(exerciseId, locals.user.id, {
            html: html as string,
            css: css as string,
            needHelp: needHelp === 'true',
            javascript: javascript as string,
        });

        return {
            submission
        }
    },

    delete: async ({ request, params ,locals}) => {
        const formData = await request.formData();
        const submissionId = formData.get('submissionId') ?? '';
        if (!submissionId) {
            error(400, 'Nu ai trimis codul');
        }
        if (!locals.user) {
            error(401, 'Nu ai permisiunea sa stergei raspunsul');
        }
        await adminService.deleteSubmission(submissionId as string);

        return {
            success: true
        }
    }
}