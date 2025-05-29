
export const load = async ({ locals, params, url }) => {
    const courseId = params.id;
    const chapterId = params.chapter_id;
    const lessonId = params.lesson_id;
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
    }

    if (courseId) {
        breadcrumbs.push({
            name: 'Curs',
            url: `/admin/course/${courseId}`
        });
    }

    if (chapterId) {
        breadcrumbs.push({
            name: 'Capitol',
            url: `/admin/course/${courseId}/chapter/${chapterId}`
        });

    }
    if (lessonId) {
        breadcrumbs.push({
            name: 'Lectie',
            url: `/admin/course/${courseId}/chapter/${chapterId}/lesson/${lessonId}`
        });
    }


    return {
        user: locals.user,
        canViewAdminPage: locals.user?.permissions.includes('course.view'),
        breadcrumbs: breadcrumbs
    };
};