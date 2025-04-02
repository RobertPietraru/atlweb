import { adminService } from "$lib/injection";

export const load = async ({ locals, params }) => {
    const page = params.page ? parseInt(params.page) : 1;
    const limit = params.limit ? parseInt(params.limit) : 10;
    const response = await adminService.getYourUnsolvedSubmissions(locals.user!.id, page, limit);
    return { user: response.submissions.map(submission => ({
        ...submission,
        exercisePage: `/course/${submission.courseId}/chapter/${submission.chapterId}/lesson/${submission.lessonId}/exercise/${submission.exerciseId}`,
    })), total: response.total };
};

