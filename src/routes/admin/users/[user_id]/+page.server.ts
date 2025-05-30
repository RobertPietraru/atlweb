    import { error, fail, redirect } from '@sveltejs/kit';
import { adminService } from '$lib/injection';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms';
import { permissionsList } from '$lib/server/db/schema';
import type * as table from '$lib/server/db/schema';
import { i18n } from '$lib/i18n';
const updateSchema = z.object({
    email: z.string().max(320, 'Email must be at most 320 characters'),
    username: z.string().max(100, 'Username must be at most 100 characters'),
});

const permissionsSchema = z.object({
    permissions: z.array(z.string())
});

export const load = async ({ params, locals }) => {
    if (!locals.user!.permissions.includes('user.view')) {
        redirect(302, i18n.resolveRoute('/'));
    }
    const user = await adminService.getUser(params.user_id);
    if (!user) {
        throw error(404, 'User not found');
    }

    const updateForm = await superValidate(user, zod(updateSchema));
    const permissionsForm = await superValidate({ permissions: user.permissions }, zod(permissionsSchema));

    return {
        user,
        updateForm,
        permissionsForm,
        allPermissions: permissionsList
    };
};

export const actions = {
    deleteUser: async ({ params, locals }) => {
        if (!locals.user!.permissions.includes('user.delete')) {
            error(403, 'Nu aveți permisiune să ștergeți utilizatori');
        }
        await adminService.deleteUser(params.user_id);
        redirect(302, i18n.resolveRoute('/admin/users'));
    },

    updateUser: async (event) => {
        if (!event.locals.user!.permissions.includes('user.edit')) {
            error(403, 'Nu aveți permisiune să actualizați utilizatori');
        }
        const form = await superValidate(event.request, zod(updateSchema));
        if (!form.valid) {
            return fail(400, { form });
        }

        const { email, username } = form.data;
        const result = await adminService.updateUser(event.params.user_id, { email, username });

        if (result === 'emailAlreadyExists') {
            setError(form, 'email', 'Această adresă de email este deja folosită');
            return fail(400, { form });
        }

        if (result === 'usernameAlreadyExists') {
            setError(form, 'username', 'Acest nume de utilizator este deja folosit');
            return fail(400, { form });
        }

        if (result === 'unknown') {
            setError(form, 'email', 'A apărut o eroare. Vă rugăm să încercați din nou.');
            return fail(400, { form });
        }

        return { form };
    },

    updatePermissions: async (event) => {
        if (!event.locals.user!.permissions.includes('user.edit')) {
            error(403, 'Nu aveți permisiune să actualizați utilizatori');
        }
        const form = await superValidate(event.request, zod(permissionsSchema));
        if (!form.valid) {
            return fail(400, { form });
        }
        await adminService.updateUserPermissions(event.params.user_id, form.data.permissions.filter(permission => permissionsList.includes(permission as table.Permissions)) as table.Permissions[]);
        return { form };
    }
};
