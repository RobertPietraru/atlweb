<script lang="ts">
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';

	import '../app.css';

	import { Toaster } from '$lib/components/ui/sonner';
	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<Toaster />

	{@render children()}
</ParaglideJS>
