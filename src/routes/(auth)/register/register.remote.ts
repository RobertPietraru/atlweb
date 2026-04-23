import { form, getRequestEvent } from '$app/server';
import { invalid, redirect, error } from '@sveltejs/kit';
import * as v from 'valibot';
import { authService } from '$lib/injection';
import { i18n } from '$lib/i18n';
import { RateLimiter } from 'sveltekit-rate-limiter/server';

const limiter = new RateLimiter({
	IP: [10, 'h'],
	IPUA: [5, 'm']
});

export const register = form(
	v.object({
		email: v.pipe(v.string(), v.maxLength(320, 'Emailul trebuie sa aiba maxim 320 caractere')),
		username: v.pipe(v.string(), v.maxLength(100, 'Username-ul trebuie sa aiba maxim 100 caractere')),
		_password: v.pipe(v.string(), v.maxLength(640, 'Parola trebuie sa aiba maxim 640 caractere')),
		redirectUrl: v.optional(v.string(), '/')
	}),
	async ({ email, username, _password, redirectUrl }, issue) => {
		const event = getRequestEvent();

		if (await limiter.isLimited(event)) {
			error(429, 'Prea multe incercari de inregistrare. Te rugam sa astepti o perioada de timp.');
		}

		const userId = await authService.createAccount(email, username, _password);

		if (userId === 'emailAlreadyExists') {
			invalid(issue.email('Acest email este deja folosit'));
		}

		if (userId === 'usernameAlreadyExists') {
			invalid(issue.username('Acest username este deja folosit'));
		}

		if (userId === 'unknown') {
			invalid(issue.email('A aparut o eroare. Te rugam sa incerci din nou.'));
		}

		const sessionToken = await authService.generateSessionToken();
		const session = await authService.createSession(sessionToken, userId as string);
		authService.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		const canonicalPath = i18n.route(redirectUrl);
		redirect(302, i18n.resolveRoute(canonicalPath));
	}
);
