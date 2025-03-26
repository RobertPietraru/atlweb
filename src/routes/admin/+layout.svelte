<script lang="ts">
	import { House, UsersRound, LogOut, PersonStanding, BookOpen, BookOpenText, CodeXml } from 'svelte-lucide';
	import { page } from '$app/stores';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let { children, data } = $props();

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
		},
		{
			title: 'Users',
			url: 'admin/users',
			items: [
				{
					title: 'Users',
					icon: UsersRound,
					url: 'admin/users'
				}
			]
		},
		{
			title: 'Cursuri',
			url: 'admin/courses',
			items: [
				{
					title: 'Cursuri',
					icon: BookOpen,
					url: 'admin/courses'
				},
				{
					title: 'Exercitii',
					icon: CodeXml,
					url: 'admin/exercises'
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
	<Sidebar.Root bind:ref={sidebarRef} class="p-1">
		<Sidebar.Header>
			<a class="text-3xl font-bold transition-colors hover:text-muted" href="/"> ADMIN </a>
		</Sidebar.Header>
		<Sidebar.Content class="space-y-3">
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
							<button
								{...props}
								onclick={logout}
								class="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-destructive/10"
							>
								<LogOut class="h-4 w-4 text-red-500" />
								<span class="font-medium text-red-500">Deconectare</span>
							</button>
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
		</header>
		<div class="min-h-[calc(100vh-4rem)] flex-1 rounded-xl bg-muted/50">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
