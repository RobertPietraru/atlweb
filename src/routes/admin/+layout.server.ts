import * as m from '$lib/paraglide/messages.js';

export const load = async ({ locals, params, url }) => {
    const courseId = params.course_id;
    const chapterId = params.chapter_id;
    const lessonId = params.lesson_id;
    const exerciseId = params.exercise_id;
    const userId = params.user_id;
    let breadcrumbs: { name: string, url: string }[] = [];

    breadcrumbs.push({
        name: m.breadcrumbs_admin(),
        url: '/admin'
    });

    if (url.pathname.includes('/courses')) {
        breadcrumbs.push({
            name: m.breadcrumbs_courses(),
            url: '/admin/courses'
        });

        if (url.pathname.includes('/create')) {
            breadcrumbs.push({
                name: m.breadcrumbs_new_course(),
                url: '/admin/courses/create'
            });
        }
    } else if (url.pathname.includes('/exercises')) {
        breadcrumbs.push({
            name: m.breadcrumbs_exercises(),
            url: '/admin/exercises'
        });
    } else if (url.pathname.includes('/users')) {
        breadcrumbs.push({
            name: m.breadcrumbs_users(),
            url: '/admin/users'
        });
    }

    if (courseId) {
        breadcrumbs.push({
            name: m.breadcrumbs_course(),
            url: `/admin/courses/${courseId}`
        });
    }

    if (chapterId) {
        breadcrumbs.push({
            name: m.breadcrumbs_chapter(),
            url: `/admin/courses/${courseId}/chapters/${chapterId}`
        });

    }
    if (lessonId) {
        breadcrumbs.push({
            name: m.breadcrumbs_lesson(),
            url: `/admin/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`
        });
    }

    if (exerciseId) {
        breadcrumbs.push({
            name: m.breadcrumbs_exercise(),
            url: `/admin/exercises/${exerciseId}`
        });
    }
    if (userId) {
        breadcrumbs.push({
            name: m.breadcrumbs_user(),
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