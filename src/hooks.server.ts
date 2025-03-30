import { redirect, type Handle, } from '@sveltejs/kit';
import type { ServerInit } from '@sveltejs/kit';
import { authService} from '$lib/injection';
import { sequence } from '@sveltejs/kit/hooks';
import log from '$lib/logging';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(authService.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		event.locals.permissions = [];
		return resolve(event);
	}

	const { session, user } = await authService.validateSessionToken(sessionToken);
	if (session) {
		authService.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		/// get the user permissions
		const permissions = await authService.getUserPermissions(user.id);
		event.locals.permissions = permissions;

		event.locals.user = user;
		event.locals.session = session;
	} else {
		authService.deleteSessionTokenCookie(event);

		event.locals.user = null;
		event.locals.session = null;
		event.locals.permissions = [];
	}


	return resolve(event);
};


const unprotectedPrefix = ['/login', '/register', '/course'];
export const authentication: Handle = async ({ event, resolve }) => {
	// Protect any routes that don't start with the unprotectedPrefix or are not the root path
	if (!unprotectedPrefix.some((path) => event.url.pathname.startsWith(path)) && event.url.pathname !== '/') {
		if (!event.locals.user) {
			redirect(303, '/login?redirect=' + event.url.pathname);
		}
	}

	// If the request is still here, just proceed as normally
	const result = await resolve(event);
	return result;
};


export const handle: Handle = sequence(handleAuth, authentication);
export const init: ServerInit = async () => {
	log.info('=== Starting app ===');
};
