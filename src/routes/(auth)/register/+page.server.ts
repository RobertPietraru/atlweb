import { redirect } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';

export const load = async (event) => {
	if (event.locals.user) {
		const canonicalPath = i18n.route(event.url.searchParams.get('redirect') || '/');
		return redirect(302, i18n.resolveRoute(canonicalPath));
	}
	const redirectUrl = event.url.searchParams.get('redirect') || '/';
	return { redirectUrl };
};
