import * as Sentry from '@sentry/sveltekit';
import { redirect, type Handle, } from '@sveltejs/kit';
import type { ServerInit } from '@sveltejs/kit';
import { authService } from '$lib/injection';
import { sequence } from '@sveltejs/kit/hooks';
import log from '$lib/logging';

Sentry.init({
	dsn: "https://0a2e1ef7768157821c8f0033c790384d@o4509090413936640.ingest.de.sentry.io/4509090414329936",
	tracesSampleRate: 1
})

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(authService.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		authService.deleteSessionTokenCookie(event);
		return resolve(event);
	}

	const { session, user } = await authService.validateSessionToken(sessionToken);
	if (session) {
		authService.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		/// get the user permissions
		event.locals.user = user;
		event.locals.session = session;
	} else {
		authService.deleteSessionTokenCookie(event);

		event.locals.user = null;
		event.locals.session = null;
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


export const handle: Handle = sequence(Sentry.sentryHandle(), sequence(handleAuth, authentication));
export const init: ServerInit = async () => {
	log.info('=== Starting app ===');
};
export const handleError = Sentry.handleErrorWithSentry();