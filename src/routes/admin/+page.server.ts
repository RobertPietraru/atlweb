export const load = async ({ locals, params }) => {
    return {
        user: locals.user,
        canViewAdminCoursesPage: locals.user?.permissions.includes('course.view'),
        canViewAdminUsersPage: locals.user?.permissions.includes('user.view'),
    };
};
