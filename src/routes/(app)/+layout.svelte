<script lang="ts">
	import { House, UsersRound, LogOut, PersonStanding, LogIn } from 'svelte-lucide';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import { toggleMode } from 'mode-watcher';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let { children, data } = $props();
	const isMobile = new IsMobile();

	const navMain = [
		{
			title: 'Navigare',
			url: '/',
			items: [
				{
					title: 'Home',
					icon: House,
					url: '/'
				}
			]
		}
	];

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

	let sidebarRef: HTMLElement | null = $state(null);
</script>

<Sidebar.Provider>
	<Sidebar.Root bind:ref={sidebarRef}>
		<Sidebar.Header>
			<a class="text-3xl font-bold transition-colors hover:text-muted" href="/"> ATLWEB </a>
		</Sidebar.Header>
		<Sidebar.Content class="space-y-3">
			<!-- We create a Sidebar.Group for each parent. -->
			{#each navMain as group (group.title)}
				<Sidebar.Group class="space-y-3">
					<Sidebar.GroupLabel class="px-2 text-sm font-medium text-muted-foreground"
						>{group.title}</Sidebar.GroupLabel
					>
					<Sidebar.GroupContent>
						<Sidebar.Menu class="space-y-1">
							{#each group.items as item (item.title)}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton isActive={$page.url.pathname.includes(item.url)}>
										{#snippet child({ props })}
											<a
												href={item.url}
												{...props}
												class={`flex items-center gap-3 rounded-lg px-2 py-2 transition-colors ${$page.url.pathname.includes(item.url) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
											>
												<svelte:component this={item.icon} class="h-4 w-4" />
												<span class="font-medium">{item.title}</span>
											</a>
										{/snippet}
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							{/each}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Sidebar.Group>
			{/each}
		</Sidebar.Content>
		<Sidebar.Footer class="mt-auto pt-6">
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							{#if data.user}
								<button
									{...props}
									onclick={logout}
									class="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-destructive/10"
								>
									<LogOut class="h-4 w-4 text-red-500" />
									<span class="font-medium text-red-500">Deconectare</span>
								</button>
							{:else}
								<a
									href="/login"
									class="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted"
								>
									<LogIn class="h-4 w-4" />
									<span class="font-medium">Conectare</span>
								</a>
							{/if}
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Footer>
		<Sidebar.Rail />
	</Sidebar.Root>
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Breadcrumb.Root>
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
			<Button onclick={toggleMode} variant="ghost" size="icon">
				<Sun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</header>
		<div class="min-h-[calc(100vh-4rem)] flex-1 rounded-xl bg-muted/50">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
