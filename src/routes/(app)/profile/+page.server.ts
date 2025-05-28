import { adminService } from "$lib/injection";
import type { Submission } from "$lib/server/db/schema";
export const load = async ({ locals, url }) => {
    const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : 1;
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : 10;
    return {
        submissions: [] as Submission[],
        total: 0,
        page,
        limit
    };
};

