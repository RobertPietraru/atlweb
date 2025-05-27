import { error, redirect } from '@sveltejs/kit';
import { adminService } from '$lib/injection';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms';
import { cache } from '$lib/cache.js';

const schema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
});

const reorderSchema = z.object({
    chapters: z.array(z.string())
});

export const load = async ({ locals, params }) => {
    if (!locals.user!.permissions.includes('course.view')) {
        error(403, 'You do not have permission to view this course');
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
    createChapter: async ({ locals, params }) => {
        if (!locals.user) {
            redirect(302, '/login');
        }

        const hasPermission = locals.user!.permissions.includes('course.edit') && locals.user!.permissions.includes('course.create')

        if (!hasPermission) {
            error(403, 'Nu ai permisiunea să creezi un capitol');
        }

        let id = await adminService.createChapter(params.id, {
            name: 'Capitol nou',
            description: 'Descrierea capitolului'
        });
        cache.courses = null;
        redirect(302, `/admin/course/${params.id}/chapter/${id}`);
    },
    update: async ({ request, locals, params }) => {
        const hasPermission = locals.user!.permissions.includes('course.edit') 
        const formData = await request.formData();
        const name = formData.get('name');
        const description = formData.get('description');


        if (!hasPermission) {
            error(403, 'Nu ai permisiunea să editezi acest curs');
        }

        await adminService.updateCourse(params.id, {
            name: name as string,
            description: description as string
        });

        return { success: true };

    },
    manageChapters: async ({ request, locals, params }) => {
        const hasPermission = locals.user!.permissions.includes('course.edit')
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
