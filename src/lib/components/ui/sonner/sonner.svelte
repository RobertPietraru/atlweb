<script lang="ts">
	import { onMount } from "svelte";
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from "svelte-sonner";

	let restProps: SonnerProps = $props();
	let isDarkTheme = $state(false);

	onMount(() => {
		isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
	});
</script>

<Sonner
	theme={isDarkTheme ? 'dark': 'light'}
	class="toaster group"
	toastOptions={{
		classes: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
		},
	}}
	{...restProps}
/>
