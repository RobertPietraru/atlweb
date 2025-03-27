import { error, redirect } from '@sveltejs/kit';
import { adminService } from '$lib/injection';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms';

const schema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
});

const reorderSchema = z.object({
    chapters: z.array(z.string())
});

export const load = async ({ locals, params }) => {
    if (!locals.user) {
        redirect(302, '/login');
    }

    const hasPermission = await adminService.hasPermission(locals.user.id, 'course.view');

    if (!hasPermission) {
        redirect(302, '/');
    }

    const course = await adminService.getCourseWithChapters(params.id);
    if (!course) {
        error(404, 'Course not found');
    }

    const form = await superValidate(zod(schema));

    return {
        course,
        form
    };
};

export const actions = {
    create: async ({ request, locals, params }) => {
        if (!locals.user) {
            redirect(302, '/login');
        }

        const hasPermission = await adminService.hasPermissions(locals.user.id, ['course.edit', 'course.create']);
        if (!hasPermission) {
            redirect(302, '/');
        }

        const form = await superValidate(request, zod(schema));
        if (!form.valid) {
            return { form };
        }

        await adminService.createChapter(params.id, form.data);
        return { form };
    },
    manageChapters: async ({ request, locals, params }) => {
        if (!locals.user) {
            redirect(302, '/login');
        }

        const hasPermission = await adminService.hasPermission(locals.user.id, 'course.edit');
        if (!hasPermission) {
            redirect(302, '/');
        }
        const course = await adminService.getCourseWithChapters(params.id);

        if (!course) {
            error(404, 'Course not found');
        }

        const data = await request.json();
        const form = await superValidate(data, zod(reorderSchema));
        if (!form.valid) {
            return { form };
        }

        /// delete all the chapters not in the list
        for (const chapter of course.chapters) {
            if (!form.data.chapters.includes(chapter.id)) {
                await adminService.deleteChapter(chapter.id);
            }
        }

        await adminService.reorderAllChapters(form.data.chapters);
        return { success: true };
    }
};
