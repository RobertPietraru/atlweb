
export const load = async ({ locals, params, url }) => {
    const courseId = params.course_id;
    const chapterId = params.chapter_id;
    const lessonId = params.lesson_id;
    const exerciseId = params.exercise_id;
    const userId = params.user_id;
    let breadcrumbs: { name: string, url: string }[] = [];

    breadcrumbs.push({
        name: 'Panou administrativ',
        url: '/admin'
    });

    if (url.pathname.includes('/courses')) {
        breadcrumbs.push({
            name: 'Cursuri',
            url: '/admin/courses'
        });

        if (url.pathname.includes('/create')) {
            breadcrumbs.push({
                name: 'Curs nou',
                url: '/admin/courses/create'
            });
        }
    } else if (url.pathname.includes('/exercises')) {
        breadcrumbs.push({
            name: 'Exercitii',
            url: '/admin/exercises'
        });
    } else if (url.pathname.includes('/users')) {
        breadcrumbs.push({
            name: 'Utilizatori',
            url: '/admin/users'
        });
    }

    if (courseId) {
        breadcrumbs.push({
            name: 'Curs',
            url: `/admin/courses/${courseId}`
        });
    }

    if (chapterId) {
        breadcrumbs.push({
            name: 'Capitol',
            url: `/admin/courses/${courseId}/chapters/${chapterId}`
        });

    }
    if (lessonId) {
        breadcrumbs.push({
            name: 'Lectie',
            url: `/admin/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`
        });
    }

    if (exerciseId) {
        breadcrumbs.push({
            name: 'Exercitiu',
            url: `/admin/exercises/${exerciseId}`
        });
    }
    if (userId) {
        breadcrumbs.push({
            name: 'Utilizator',
            url: `/admin/users/${userId}`
        });
    }

    return {
        user: locals.user,
        canViewAdminPage: locals.user?.permissions.includes('course.view'),
        breadcrumbs: breadcrumbs,
        isExercisePage: Boolean(exerciseId)
    };
};