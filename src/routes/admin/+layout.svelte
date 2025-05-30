<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { ShieldUser, LogOut, UserRound, Loader2, BookOpen } from '@lucide/svelte';
	import { Sun, Moon } from 'lucide-svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { BrainCircuit } from '@lucide/svelte';
	import { Languages } from '@lucide/svelte';
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
		const res = await fetch('/api/auth/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		/// reload page
		if (res.ok) {
			location.reload();
		} else {
			console.error('Failed to logout');
		}
	}
</script>

<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
	<a href="/" class="mr-4 text-2xl font-bold">ATLWEB</a>
	<div class="flex-1"></div>

	<div class="flex items-center gap-1 md:gap-3">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
				<Languages class="h-[1.2rem] w-[1.2rem]" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item
					onclick={() => switchToLanguage('ro')}
					class={languageTag() === 'ro' ? 'bg-accent' : ''}>Română</DropdownMenu.Item
				>
				<DropdownMenu.Item
					onclick={() => switchToLanguage('en')}
					class={languageTag() === 'en' ? 'bg-accent' : ''}>English</DropdownMenu.Item
				>
				<DropdownMenu.Item
					onclick={() => switchToLanguage('hu')}
					class={languageTag() === 'hu' ? 'bg-accent' : ''}>Magyar</DropdownMenu.Item
				>
				<DropdownMenu.Item
					onclick={() => switchToLanguage('uk')}
					class={languageTag() === 'uk' ? 'bg-accent' : ''}>Українська</DropdownMenu.Item
				>
				<DropdownMenu.Item
					onclick={() => switchToLanguage('de')}
					class={languageTag() === 'de' ? 'bg-accent' : ''}>Deutsch</DropdownMenu.Item
				>
				<DropdownMenu.Item
					onclick={() => switchToLanguage('ru')}
					class={languageTag() === 'ru' ? 'bg-accent' : ''}>Русский</DropdownMenu.Item
				>
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<Button
			onclick={() => {
				isDarkTheme = !isDarkTheme;
			}}
			variant="ghost"
			size="icon"
		>
			<Sun
				class="absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out dark:translate-y-8 dark:rotate-180 dark:scale-75 dark:opacity-0"
			/>
			<Moon
				class="h-[1.2rem] w-[1.2rem] translate-y-8 rotate-180 scale-75 opacity-0 transition-all duration-500 ease-in-out dark:translate-y-0 dark:rotate-0 dark:scale-100 dark:opacity-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
		{#if !data.user}
			<Button href="/login" variant="outline">Autentifica-te</Button>
		{:else}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					class={buttonVariants({
						variant: 'default',
						class: 'aspect-square rounded-full bg-accent text-accent-foreground hover:bg-accent/60'
					})}
				>
					{#if data.user.username}
						<div class="flex h-8 w-8 items-center justify-center">
							{data.user.username
								.split(' ')
								.map((name: string) => name[0])
								.join('')
								.toUpperCase()}
						</div>
					{/if}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="w-56">
					<DropdownMenu.Label>
						<div class="flex items-center gap-2">
							<div
								class="aspect-square rounded-full bg-accent text-accent-foreground hover:bg-accent/60"
							>
								{#if data.user.username}
									<div class=" flex h-10 w-10 items-center justify-center">
										{data.user.username
											.split(' ')
											.map((name: string) => name[0])
											.join('')
											.toUpperCase()}
									</div>
								{/if}
							</div>
							<div class="flex flex-col gap-1 px-2 py-1.5">
								<span class="truncate text-sm font-medium">{data.user.username}</span>
								<span class="text-xs capitalize text-muted-foreground">
									{#if data.canViewAdminPage}
										Cont de administrator
									{:else}
										Utilizator
									{/if}
								</span>
							</div>
						</div>
					</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item
						onclick={() => localizedGoto(page.url.toString(), '/profile')}
						class="flex items-center {canonicalPath.startsWith('/profile')
							? 'bg-accent'
							: ''}"
					>
						<UserRound class="mr-2.5 h-4 w-4" />
						Profil
					</DropdownMenu.Item>
					<DropdownMenu.Item
						onclick={() => localizedGoto(page.url.toString(), '/courses')}
						class="flex items-center {canonicalPath.startsWith('/courses') ? 'bg-accent' : ''}"
					>
						<BookOpen class="mr-2.5 h-4 w-4" />
						Cursuri
					</DropdownMenu.Item>
					<DropdownMenu.Item
						onclick={() => localizedGoto(page.url.toString(), '/exercises')}
						class="flex items-center {canonicalPath.startsWith('/exercises')
							? 'bg-accent'
							: ''}"
					>
						<BrainCircuit class="mr-2.5 h-4 w-4" />
						Exerciții
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					{#if data.canViewAdminPage}
						<DropdownMenu.Item
							class="flex items-center {canonicalPath.startsWith('/admin') ? 'bg-accent' : ''}"
							onclick={() => localizedGoto(page.url.toString(), '/admin')}
							disabled={logoutLoading}
						>
							<ShieldUser class="mr-2.5 h-4 w-4" />
							<span>Administrator</span>
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
					{/if}

					<DropdownMenu.Item
						class="flex items-center text-destructive focus:text-destructive"
						onclick={logout}
						disabled={logoutLoading}
					>
						{#if logoutLoading}
							<Loader2 class="mr-2.5 h-4 w-4 animate-spin" />
						{:else}
							<LogOut class="mr-2.5 h-4 w-4" />
						{/if}
						<span>Log out</span>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
	</div>
</header>

<div
	class="min-h-[calc(100vh-4rem)] flex-1 rounded-xl {data.isExercisePage
		? 'pl-4'
		: 'container'} space-y-4 py-4"
>
	<Breadcrumb.Root class="flex items-center">
		<Breadcrumb.List>
			<Breadcrumb.Separator />
			{#each data.breadcrumbs as crumb, i}
				<Breadcrumb.Item>
					<Breadcrumb.Link href={crumb.url}>
						{crumb.name}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				{#if i < data.breadcrumbs.length - 1}
					<Breadcrumb.Separator />
				{/if}
			{/each}
		</Breadcrumb.List>
	</Breadcrumb.Root>
	{@render children()}
</div>

<footer
	class="z-40 flex flex-col gap-8 border-t bg-background px-8 py-12 text-sm text-muted-foreground"
>
	<div class="container grid grid-cols-1 gap-8 md:grid-cols-4">
		<div class="flex flex-col gap-4">
			<h3 class="text-lg font-semibold">ATLWEB</h3>
			<p class="max-w-xs">
				Platforma educațională pentru învățarea programării web într-un mod interactiv și practic.
			</p>
		</div>

		<div class="flex flex-col gap-4">
			<h3 class="text-lg font-semibold">Navigare</h3>
			<nav class="flex flex-col gap-2">
				<a href="/" class="hover:text-primary">Acasă</a>
				<a href="/courses" class="hover:text-primary">Cursuri</a>
				<a href="/profile" class="hover:text-primary">Profil</a>
			</nav>
		</div>

		<div class="flex flex-col gap-4">
			<h3 class="text-lg font-semibold">Legal</h3>
			<nav class="flex flex-col gap-2">
				<a href="/terms" class="hover:text-primary">Termeni și Condiții</a>
				<a href="/privacy" class="hover:text-primary">Politica de Confidențialitate</a>
				<a href="/cookies" class="hover:text-primary">Politica de Cookie-uri</a>
			</nav>
		</div>

		<div class="flex flex-col gap-4">
			<h3 class="text-lg font-semibold">Contact</h3>
			<nav class="flex flex-col gap-2">
				<a href="mailto:rob_piet@yahoo.com" class="hover:text-primary">rob_piet@yahoo.com</a>
				<div class="flex gap-4">
					<a href="https://github.com/RobertPietraru/atlweb" class="hover:text-primary">GitHub</a>
				</div>
			</nav>
		</div>
	</div>

	<div class="container flex items-center justify-between border-t pt-8">
		<span>©2025 ATLWEB - Toate drepturile rezervate</span>
		<span>Făcut cu ❤️ în România</span>
	</div>
</footer>
