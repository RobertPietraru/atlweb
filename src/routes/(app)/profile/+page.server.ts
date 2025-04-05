import { adminService } from "$lib/injection";

export const load = async ({ locals, url }) => {
    const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : 1;
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : 10;
    const response = await adminService.getYourUnsolvedSubmissions(locals.user!.id, page, limit);
    return { user: response.submissions.map(submission => ({
        ...submission,
        exercisePage: `/course/${submission.courseId}/chapter/${submission.chapterId}/lesson/${submission.lessonId}/exercise/${submission.exerciseId}`,

    })), total: response.total, page, limit };
};

