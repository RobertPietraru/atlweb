import { form, getRequestEvent } from '$app/server';
import { invalid, redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import { authService } from '$lib/injection';
import { i18n } from '$lib/i18n.js';

export const login = form(
	v.object({
		email: v.pipe(v.string(), v.maxLength(320, 'Emailul trebuie sa aiba maxim 320 caractere')),
		_password: v.pipe(v.string(), v.maxLength(640, 'Parola trebuie sa aiba maxim 640 caractere')),
		redirectUrl: v.optional(v.string(), '/')
	}),
	async ({ email, _password, redirectUrl }, issue) => {
		const event = getRequestEvent();

		const userId = await authService.login(email, _password);
		if (userId === 'wrongCredentials') {
			invalid(issue.email('Email sau parola gresita'), issue._password('Email sau parola gresita'));
		}

		const sessionToken = await authService.generateSessionToken();
		const session = await authService.createSession(sessionToken, userId);
		authService.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		redirect(302, i18n.resolveRoute(i18n.route(redirectUrl)));
	}
);
