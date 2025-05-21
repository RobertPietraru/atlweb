import { adminService } from "$lib/injection";


export let cache: {
    courses: Awaited<ReturnType<typeof adminService.getCourses>> | null,
} = {
    courses: null,
}