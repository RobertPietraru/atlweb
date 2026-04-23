import { redirect } from '@sveltejs/kit';
import { i18n } from '$lib/i18n.js';

export const load = async (event) => {
	if (event.locals.user) {
		return redirect(302, i18n.resolveRoute('/'));
	}
	const redirectUrl = event.url.searchParams.get('redirect') || '/';
	return { redirectUrl };
};
