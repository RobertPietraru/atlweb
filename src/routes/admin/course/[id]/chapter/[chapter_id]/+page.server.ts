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
    lessons: z.array(z.string())
});

export const load = async ({ locals, params }) => {
    if (!locals.user) {
        redirect(302, '/login');
    }

    const hasPermission = await adminService.hasPermission(locals.user.id, 'chapter.view');

    if (!hasPermission) {
        redirect(302, '/');
    }

    const chapter = await adminService.getChapterWithLessons(params.chapter_id);
    if (!chapter) {
        error(404, 'Chapter not found');
    }

    const form = await superValidate({
        name: chapter.name,
        description: chapter.description
    }, zod(schema));

    return {
        chapter,
        form,
        courseId: params.id
    };
};

export const actions = {
    create: async ({ locals, params }) => {
        const hasPermission = await adminService.hasPermissions(locals.user!.id, ['lesson.edit', 'lesson.create']);
        if (!hasPermission) {
            error(403, 'Nu ai permisiune să creezi lecții');
        }
        const lessonId = await adminService.createLesson(params.chapter_id);
        redirect(302, `/admin/course/${params.id}/chapter/${params.chapter_id}/lesson/${lessonId}`);

    },
    manageLessons: async ({ request, locals, params }) => {
        const hasPermission = await adminService.hasPermission(locals.user!.id, 'lesson.edit');
        if (!hasPermission) {
            redirect(302, '/');
        }
        const chapter = await adminService.getChapterWithLessons(params.chapter_id);

        if (!chapter) {
            error(404, 'Chapter not found');
        }

        const data = await request.json();
        const form = await superValidate(data, zod(reorderSchema));
        if (!form.valid) {
            return { form };
        }

        /// delete all the chapters not in the list
        for (const lesson of chapter.lessons) {
            if (!form.data.lessons.includes(lesson.id)) {
                await adminService.deleteLesson(lesson.id);
            }
        }

        await adminService.reorderAllLessons(form.data.lessons);
        return { success: true };
    },
    update: async ({ request, locals, params }) => {
        const hasPermission = await adminService.hasPermission(locals.user!.id, 'course.edit');

        if (!hasPermission) {
            error(403, 'You do not have permission to edit this course');
        }

        const form = await superValidate(request, zod(schema));
        if (!form.valid) {
            return { form };
        }

        await adminService.updateChapter(params.chapter_id, {
            name: form.data.name,
            description: form.data.description
        });

        return { success: true };

    },
};
