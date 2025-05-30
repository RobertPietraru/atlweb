<script lang="ts">
		import * as m from '$lib/paraglide/messages.js';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
</script>

<main class="min-h-[100vh] w-full py-4">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold">{m.admin_users_title()}</h1>
		<Button href="/admin/users/create">{m.admin_users_create()}</Button>
	</div>

	<div class="relative w-full overflow-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b">
					<th class="h-12 px-4 text-left align-middle font-medium">{m.admin_users_username()}</th>
					<th class="h-12 px-4 text-left align-middle font-medium">{m.admin_users_email()}</th>
					<th class="h-12 px-4 text-left align-middle font-medium">{m.admin_users_permissions()}</th>
					<th class="h-12 px-4 text-right align-middle font-medium">{m.admin_users_actions()}</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users as user}
					<tr class="border-b transition-colors hover:bg-muted/50">
						<td class="p-4 align-middle">{user.username}</td>
						<td class="p-4 align-middle">{user.email}</td>
						<td class="p-4 align-middle">
							<div class="flex flex-wrap gap-1">
								{#each user.permissions.slice(0, 10) as permission}
									<span
										class="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
									>
										{permission}
									</span>
								{/each}
								{#if user.permissions.length > 10}
									<span
										class="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
										>...</span
									>
								{:else if user.permissions.length === 0}
									<span class="text-muted-foreground">{m.admin_users_no_permissions()}</span>
								{/if}
							</div>
						</td>
						<td class="p-4 align-middle">
							<div class="flex justify-end gap-2">
								<Button href="/admin/users/{user.id}" variant="outline" size="sm">{m.admin_users_view()}</Button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>
