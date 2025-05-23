<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { ShieldUser, LogOut, LogIn, UserRound, Settings, Loader2 } from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Sun, Moon } from 'lucide-svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let { children, data } = $props();
	let isDarkTheme = $state(false);
	let logoutLoading = $state(false);
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
								<p class="truncate text-sm font-medium">{data.user.username}</p>
								<p class="text-xs capitalize text-muted-foreground">
									{#if data.canViewAdminPage}
										Cont de administrator
									{:else}
										Utilizator
									{/if}
								</p>
							</div>
						</div>
					</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>
						<UserRound class="mr-2.5 h-4 w-4" />
						<a href="/profile" id="profile-button">Profil</a>
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					{#if data.canViewAdminPage}
						<DropdownMenu.Item
							class="flex items-center {window.location.pathname.startsWith('/admin')
								? 'bg-accent'
								: ''}"
							onclick={() => goto('/admin')}
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

<div class="min-h-[calc(100vh-4rem)] flex-1 rounded-xl bg-muted/50">
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
				<p class="text-muted-foreground">Prof. coordonator:</p>
				<p class="hover:text-primary">Giocaș Afrodita</p>
				<p class="hover:text-primary">Cardaș Cerasela</p>

				<a href="mailto:rob_piet@yahoo.com" class="hover:text-primary">rob_piet@yahoo.com</a>
				<div class="flex gap-4">
					<a href="https://github.com/RobertPietraru/atlweb" class="hover:text-primary">GitHub</a>
				</div>
			</nav>
		</div>
	</div>

	<div class="container flex items-center justify-between border-t pt-8">
		<p>© {2024} ATLWEB - Toate drepturile rezervate</p>
		<p>Făcut cu ❤️ în România</p>
	</div>
</footer>
