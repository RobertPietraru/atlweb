import { authService } from '$lib/injection';
import { json, redirect } from '@sveltejs/kit';

export async function POST(event) {
    if (!event.locals.session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    await authService.invalidateSession(event.locals.session.id);
    authService.deleteSessionTokenCookie(event);
    
    throw redirect(302, '/login');
    
}