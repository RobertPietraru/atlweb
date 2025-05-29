import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { adminService } from '$lib/injection';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user) {
        redirect(302, `/login?redirect=/exercises/${params.exercise_id}/submissions`);
    }

    if (!locals.user!.permissions.includes('submission.solve')) {
        error(403, 'Nu ai permisiunea sa rezolvi exercitiile');
    }

    const exercise = await adminService.getExercise(params.exercise_id);
    if (!exercise) {
        error(404, 'Exercise not found');
    }

    const submissions = await adminService.getSubmissionsToCheck(params.exercise_id);

    return {
        exercise,
        submissions,
    };
};

export const actions = {
    submit: async ({ request, params, locals }) => {
        const formData = await request.formData();
        const html = formData.get('html') ?? '';
        const css = formData.get('css') ?? '';
        const javascript = formData.get('javascript') ?? '';
        const needHelp = formData.get('needHelp') ?? 'false';
        if (!html && !css && !javascript) {
            return fail(400, { message: 'Nu ai trimis codul' });
        }

        if (!locals.user) {
            return fail(400, { message: 'Nu ai permisiunea sa trimiti codul' });
        }

        const submission = await adminService.createSubmission(params.exercise_id, locals.user.id, {
            html: html as string,
            css: css as string,
            needHelp: needHelp === 'true',
            javascript: javascript as string,
        });

        return {
            submission
        }
    },

    solve: async ({ request, params, locals }) => {
        const formData = await request.formData();
        const submissionId = formData.get('submissionId') ?? '';

        const html = formData.get('html') ?? '';
        const css = formData.get('css') ?? '';
        const javascript = formData.get('javascript') ?? '';

        if (!submissionId) {
            error(400, 'Nu ai trimis codul');
        }

        if (!locals.user!.permissions.includes('submission.solve')) {
            error(401, 'Nu ai permisiunea sa rezolvi raspunsul');
        }
        await adminService.markSubmissionAsChecked(submissionId as string, {
            html: html as string,
            css: css as string,
            javascript: javascript as string,
        });

        return {
            success: true
        }
    }
}