import { error, fail, redirect } from '@sveltejs/kit';
import { authService } from '$lib/injection';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { i18n } from '$lib/i18n';

const schema = z.object({
	email: z.string().max(320, 'Emailul trebuie sa aiba maxim 320 caractere'),
	username: z.string().max(100, 'Username-ul trebuie sa aiba maxim 100 caractere'),
	password: z.string().max(640, 'Parola trebuie sa aiba maxim 640 caractere'),
});

const limiter = new RateLimiter({
	IP: [10, 'h'], // IP address limiter
	IPUA: [5, 'm'], // IP + User Agent limiter
});

export const load = async (event) => {
	if (event.locals.user) {
		const canonicalPath = i18n.route(event.url.searchParams.get('redirect') || '/');
		return redirect(302, i18n.resolveRoute(canonicalPath));
	}
	const form = await superValidate(zod(schema));
	return { form };
};

export const actions = {
	default: async (event) => {
		if (await limiter.isLimited(event)) error(429, 'Prea multe incercari de inregistrare. Te rugam sa astepti o perioada de timp.');
		const form = await superValidate(event.request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, username, password } = form.data;
		const userId = await authService.createAccount(email, username, password);
		
		if (userId === 'emailAlreadyExists') {
			setError(form, 'email', 'Acest email este deja folosit');
			return fail(400, { form });
		}
		
		if (userId === 'usernameAlreadyExists') {
			setError(form, 'username', 'Acest username este deja folosit');
			return fail(400, { form });
		}

		if (userId === 'unknown') {
			setError(form, 'email', 'A aparut o eroare. Te rugam sa incerci din nou.');
			return fail(400, { form });
		}

		const sessionToken = await authService.generateSessionToken();
		const session = await authService.createSession(sessionToken, userId);

		authService.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		const canonicalPath = i18n.route(event.url.searchParams.get('redirect') || '/');
		return redirect(302, i18n.resolveRoute(canonicalPath));
	},
};
