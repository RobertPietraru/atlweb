
export const load = async ({ locals, params, url }) => {
    const courseId = params.course_id;
    const chapterId = params.chapter_id;
    const lessonId = params.lesson_id;
    const exerciseId = params.exercise_id;
    let breadcrumbs: { name: string, url: string }[] = [];

    breadcrumbs.push({
        name: 'Panou administrativ',
        url: '/admin'
    });

    if (url.pathname.includes('/course')) {
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
    } else if (url.pathname.includes('/exercise')) {
        breadcrumbs.push({
            name: 'Exercitii',
            url: '/admin/exercises'
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
            url: `/admin/exercise/${exerciseId}`
        });
    }

    return {
        user: locals.user,
        canViewAdminPage: locals.user?.permissions.includes('course.view'),
        breadcrumbs: breadcrumbs,
        isExercisePage: Boolean(exerciseId)
    };
};