<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { ShieldUser, LogOut, UserRound, Loader2, BookOpen, BrainCircuit, Languages } from '@lucide/svelte';
	import { Sun, Moon } from '@lucide/svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { languageTag, type AvailableLanguageTag } from '$lib/paraglide/runtime.js';
	import { i18n } from '$lib/i18n.js';
	import { localizedGoto } from '$lib/utils.js';

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route(page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}

	let { children, data } = $props();
	let isDarkTheme = $state(false);
	let logoutLoading = $state(false);

	let canonicalPath = $derived(i18n.route(page.url.pathname));

	onMount(() => {
		isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
	});

	$effect(() => {
		const htmlEl = document.documentElement;
		if (isDarkTheme) {
			localStorage.setItem('isDarkTheme', 'true');
			htmlEl.classList.add('dark');
		} else {
			localStorage.setItem('isDarkTheme', 'false');
			htmlEl.classList.remove('dark');
		}
	});

	async function logout() {
		logoutLoading = true;
		const res = await fetch('/api/auth/logout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		});
		if (res.ok) {
			location.reload();
		} else {
			console.error('Failed to logout');
			logoutLoading = false;
		}
	}

	let userInitials = $derived(
		data.user?.username
			?.split(' ')
			.map((n: string) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2) ?? '?'
	);

	const languages: { tag: AvailableLanguageTag; label: string }[] = [
		{ tag: 'ro', label: 'Română' },
		{ tag: 'en', label: 'English' },
		{ tag: 'hu', label: 'Magyar' },
		{ tag: 'uk', label: 'Українська' },
		{ tag: 'de', label: 'Deutsch' },
		{ tag: 'ru', label: 'Русский' }
	];
</script>

<header class="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-sm">
	<div class="flex h-16 items-center gap-4 px-6">
		<a href="/admin" class="flex items-center gap-2.5 font-display font-bold transition-opacity hover:opacity-80">
			<span class="text-primary">{m.brand_name()}</span>
			<span class="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
				Admin
			</span>
		</a>

		<div class="flex-1"></div>

		<div class="flex items-center gap-1">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
					<Languages class="h-[1.1rem] w-[1.1rem]" />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="w-36">
					{#each languages as lang}
						<DropdownMenu.Item
							onclick={() => switchToLanguage(lang.tag)}
							class={languageTag() === lang.tag ? 'bg-accent font-medium' : ''}
						>
							{lang.label}
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<Button onclick={() => (isDarkTheme = !isDarkTheme)} variant="ghost" size="icon">
				<Sun class="absolute h-[1.1rem] w-[1.1rem] transition-all duration-300 dark:translate-y-6 dark:rotate-90 dark:opacity-0" />
				<Moon class="h-[1.1rem] w-[1.1rem] translate-y-6 rotate-90 opacity-0 transition-all duration-300 dark:translate-y-0 dark:rotate-0 dark:opacity-100" />
				<span class="sr-only">{m.toggle_theme()}</span>
			</Button>

			{#if !data.user}
				<Button href="/login" size="sm" class="ml-1 font-display font-medium">{m.login()}</Button>
			{:else}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						class="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					>
						{userInitials}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-56">
						<DropdownMenu.Label class="pb-2">
							<div class="flex items-center gap-3">
								<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
									{userInitials}
								</div>
								<div class="flex min-w-0 flex-col">
									<span class="truncate text-sm font-semibold">{data.user.username}</span>
									<span class="text-xs capitalize text-muted-foreground">
										{data.canViewAdminPage ? m.admin_account() : m.user_account()}
									</span>
								</div>
							</div>
						</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							onclick={() => localizedGoto(page.url.toString(), '/profile')}
							class="flex items-center gap-2 {canonicalPath.startsWith('/profile') ? 'bg-accent' : ''}"
						>
							<UserRound class="h-4 w-4" />{m.profile()}
						</DropdownMenu.Item>
						<DropdownMenu.Item
							onclick={() => localizedGoto(page.url.toString(), '/courses')}
							class="flex items-center gap-2 {canonicalPath.startsWith('/courses') ? 'bg-accent' : ''}"
						>
							<BookOpen class="h-4 w-4" />{m.courses()}
						</DropdownMenu.Item>
						<DropdownMenu.Item
							onclick={() => localizedGoto(page.url.toString(), '/exercises')}
							class="flex items-center gap-2 {canonicalPath.startsWith('/exercises') ? 'bg-accent' : ''}"
						>
							<BrainCircuit class="h-4 w-4" />{m.exercises()}
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						{#if data.canViewAdminPage}
							<DropdownMenu.Item
								onclick={() => localizedGoto(page.url.toString(), '/admin')}
								class="flex items-center gap-2 {canonicalPath.startsWith('/admin') ? 'bg-accent' : ''}"
							>
								<ShieldUser class="h-4 w-4" />{m.admin()}
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
						{/if}
						<DropdownMenu.Item
							class="flex items-center gap-2 text-destructive focus:text-destructive"
							onclick={logout}
							disabled={logoutLoading}
						>
							{#if logoutLoading}
								<Loader2 class="h-4 w-4 animate-spin" />
							{:else}
								<LogOut class="h-4 w-4" />
							{/if}
							{m.logout()}
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/if}
		</div>
	</div>
</header>

{#if data.breadcrumbs?.length > 0}
	<div class="border-b bg-muted/30 px-6 py-2.5">
		<Breadcrumb.Root>
			<Breadcrumb.List>
				{#each data.breadcrumbs as crumb, i}
					<Breadcrumb.Item>
						{#if i < data.breadcrumbs.length - 1}
							<Breadcrumb.Link href={crumb.url} class="text-muted-foreground hover:text-foreground">
								{crumb.name}
							</Breadcrumb.Link>
						{:else}
							<Breadcrumb.Page>{crumb.name}</Breadcrumb.Page>
						{/if}
					</Breadcrumb.Item>
					{#if i < data.breadcrumbs.length - 1}
						<Breadcrumb.Separator />
					{/if}
				{/each}
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
{/if}

<main class="min-h-[calc(100vh-4rem)] {data.isExercisePage ? 'pl-4' : 'container'} py-6">
	{@render children()}
</main>
