<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { LogOut, LogIn, UserRound, Settings } from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { SunIcon, MoonIcon, LaptopIcon, Sun, Moon } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';

	let { children, data } = $props();
	const isMobile = new IsMobile();

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
	<Breadcrumb.Root class="flex items-center">
		<Breadcrumb.List>
			{#each data.breadcrumbs as crumb, i}
				<Breadcrumb.Item>
					<Breadcrumb.Link href={crumb.url}>
						{#if isMobile.current}
							{#if crumb.name.length > 20}
								{crumb.name.slice(0, 10)}...{crumb.name.slice(-10)}
							{:else}
								{crumb.name}
							{/if}
						{:else}
							{crumb.name}
						{/if}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				{#if i < data.breadcrumbs.length - 1}
					<Breadcrumb.Separator />
				{/if}
			{/each}
		</Breadcrumb.List>
	</Breadcrumb.Root>
	<div class="flex-1"></div>
	{#if data.user}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Avatar.Root>
					<Avatar.Fallback
						>{data
							.user!.username.split(' ')
							.map((name) => name[0])
							.join('')}</Avatar.Fallback
					>
				</Avatar.Root>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.GroupHeading>
						{data.user!.username}
					</DropdownMenu.GroupHeading>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>
						<UserRound class="h-4 w-4" />
						<a href={`/profile/${data.user!.id}`}>Profil</a>
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={toggleMode}>
						<Sun
							class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
						/>
						<Moon
							class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
						/>
						<span class="dark:hidden">Tema luminoasa</span>
						<span class="hidden dark:block">Tema întunecoasa</span>
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item onclick={logout}>
						<LogOut class="h-4 w-4 text-destructive" />
						<span class="font-medium text-destructive">Deconectare</span>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{:else}
		<a href="/login" class="flex items-center gap-2">
			<LogIn class="h-4 w-4" />
			<span class="font-medium">Conectare</span>
		</a>
	{/if}
</header>

<div class="min-h-[calc(100vh-4rem)] flex-1 rounded-xl bg-muted/50">
	{@render children()}
</div>

<footer class="flex flex-col gap-8 border-t px-8 py-12 text-sm text-muted-foreground">
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
				<a href="/exercises" class="hover:text-primary">Exerciții</a>
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
					<a href="https://facebook.com" class="hover:text-primary">Facebook</a>
					<a href="https://twitter.com" class="hover:text-primary">Twitter</a>
					<a href="https://github.com" class="hover:text-primary">GitHub</a>
				</div>
			</nav>
		</div>
	</div>

	<div class="container flex items-center justify-between border-t pt-8">
		<p>© {new Date().getFullYear()} ATLWEB - Toate drepturile rezervate</p>
		<p>Făcut cu ❤️ în România</p>
	</div>
</footer>
