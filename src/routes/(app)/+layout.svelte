<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as m from '$lib/paraglide/messages.js';
	import {
		ShieldUser,
		LogOut,
		UserRound,
		Loader2,
		BookOpen,
		BrainCircuit,
		Languages,
		Menu
	} from '@lucide/svelte';
	import { Sun, Moon } from '@lucide/svelte';
	import { page } from '$app/state';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';
	import { languageTag, type AvailableLanguageTag } from '$lib/paraglide/runtime.js';
	import { i18n } from '$lib/i18n.js';
	import { localizedGoto } from '$lib/utils.js';

	let { children, data } = $props();
	let isDarkTheme = $state(false);
	let logoutLoading = $state(false);
	let mobileMenuOpen = $state(false);

	onMount(() => {
		isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
	});

	let canonicalPath = $derived(i18n.route(page.url.pathname));

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route(page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		window.location.href = localisedPath;
	}

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
			console.error(m.failed_to_logout());
			logoutLoading = false;
		}
	}

	const navLinks = [
		{ href: '/courses', label: () => m.courses(), icon: BookOpen },
		{ href: '/exercises', label: () => m.exercises(), icon: BrainCircuit }
	];

	let userInitials = $derived(
		data.user?.username
			?.split(' ')
			.map((n: string) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2) ?? '?'
	);

	const languages: { tag: AvailableLanguageTag; label: string }[] = [
		{ tag: 'ro', label: m.language_ro() },
		{ tag: 'en', label: m.language_en() },
		{ tag: 'hu', label: m.language_hu() },
		{ tag: 'uk', label: m.language_uk() },
		{ tag: 'de', label: m.language_de() },
		{ tag: 'ru', label: m.language_ru() }
	];
</script>

<header
	class="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-sm"
>
	<div class="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-6">
		<!-- Brand -->
		<a
			href="/"
			class="flex items-center gap-2 font-display text-xl font-bold text-primary transition-opacity hover:opacity-80"
		>
			{m.brand_name()}
		</a>

		<!-- Desktop nav -->
		{#if data.user}
			<nav class="ml-4 hidden items-center gap-1 md:flex">
				{#each navLinks as link}
					<a
						href={link.href}
						class="flex items-center gap-1.5 rounded-md px-3 py-2 font-display text-sm font-medium transition-colors
							{canonicalPath.startsWith(link.href)
							? 'bg-primary/10 text-primary'
							: 'text-muted-foreground hover:bg-accent hover:text-foreground'}"
					>
						<link.icon class="h-4 w-4" />
						{link.label()}
					</a>
				{/each}
			</nav>
		{/if}

		<div class="flex-1"></div>

		<!-- Right-side controls -->
		<div class="flex items-center gap-1">
			<!-- Language picker -->
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

			<!-- Theme toggle -->
			<Button onclick={() => (isDarkTheme = !isDarkTheme)} variant="ghost" size="icon">
				<Sun
					class="absolute h-[1.1rem] w-[1.1rem] transition-all duration-300 dark:translate-y-6 dark:rotate-90 dark:opacity-0"
				/>
				<Moon
					class="h-[1.1rem] w-[1.1rem] translate-y-6 rotate-90 opacity-0 transition-all duration-300 dark:translate-y-0 dark:rotate-0 dark:opacity-100"
				/>
				<span class="sr-only">{m.toggle_theme()}</span>
			</Button>

			<!-- Auth -->
			{#if !data.user}
				<Button href="/login" size="sm" class="ml-1 font-display font-medium"
					>{m.login()}</Button
				>
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
								<div
									class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
								>
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

<main class="min-h-[calc(100vh-4rem)]">
	{@render children()}
</main>

<footer class="border-t bg-background">
	<div class="mx-auto max-w-[1280px] px-6 py-12">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
			<div class="flex flex-col gap-3">
				<span class="font-display text-lg font-bold text-primary">{m.brand_name()}</span>
				<p class="max-w-xs text-sm leading-relaxed text-muted-foreground">
					{m.footer_description()}
				</p>
			</div>

			<div class="flex flex-col gap-3">
				<h3 class="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
					{m.footer_navigation()}
				</h3>
				<nav class="flex flex-col gap-2 text-sm text-muted-foreground">
					<a href="/" class="transition-colors hover:text-primary">{m.footer_home()}</a>
					<a href="/courses" class="transition-colors hover:text-primary">{m.footer_courses()}</a>
					<a href="/profile" class="transition-colors hover:text-primary">{m.footer_profile()}</a>
				</nav>
			</div>

			<div class="flex flex-col gap-3">
				<h3 class="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
					{m.footer_legal()}
				</h3>
				<nav class="flex flex-col gap-2 text-sm text-muted-foreground">
					<a href="/terms" class="transition-colors hover:text-primary">{m.footer_terms()}</a>
					<a href="/privacy" class="transition-colors hover:text-primary">{m.footer_privacy()}</a>
					<a href="/cookies" class="transition-colors hover:text-primary">{m.footer_cookies()}</a>
				</nav>
			</div>

			<div class="flex flex-col gap-3">
				<h3 class="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
					{m.footer_contact()}
				</h3>
				<nav class="flex flex-col gap-2 text-sm text-muted-foreground">
					<a href="mailto:rob_piet@yahoo.com" class="transition-colors hover:text-primary"
						>rob_piet@yahoo.com</a
					>
					<a
						href="https://github.com/RobertPietraru/atlweb"
						class="transition-colors hover:text-primary">GitHub</a
					>
				</nav>
			</div>
		</div>

		<div
			class="mt-10 flex flex-col items-center justify-between gap-2 border-t pt-8 text-xs text-muted-foreground md:flex-row"
		>
			<span>{m.footer_copyright()}</span>
			<span>{m.footer_made_with_love()}</span>
		</div>
	</div>
</footer>
