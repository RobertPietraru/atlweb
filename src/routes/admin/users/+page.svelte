<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '$lib/components/ui/dropdown-menu';
	import { MoreHorizontal } from 'lucide-svelte';

	let { data } = $props();
</script>

<main class="min-h-[100vh] w-full px-8 py-4">
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-3xl font-bold">Users</h1>
		<Button href="/admin/users/create">Create New User</Button>
	</div>

	<div class="relative w-full overflow-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b">
					<th class="h-12 px-4 text-left align-middle font-medium">Username</th>
					<th class="h-12 px-4 text-left align-middle font-medium">Email</th>
					<th class="h-12 px-4 text-left align-middle font-medium">Permissions</th>
					<th class="h-12 px-4 text-right align-middle font-medium">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users as user}
					<tr class="border-b hover:bg-muted/50 transition-colors">
						<td class="p-4 align-middle">{user.username}</td>
						<td class="p-4 align-middle">{user.email}</td>
						<td class="p-4 align-middle">
							<div class="flex flex-wrap gap-1 ">
								{#each user.permissions.slice(0, 10) as permission}
									<span class="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
										{permission}
									</span>
								{/each}
								{#if user.permissions.length > 10}
									<span class="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">...</span>
								{:else if user.permissions.length === 0}
									<span class="text-muted-foreground">No permissions</span>
								{/if}
							</div>
						</td>
						<td class="p-4 align-middle">
							<div class="flex gap-2 justify-end">
								<Button href="/admin/user/{user.id}" variant="outline" size="sm">
									View
								</Button>
								
								<DropdownMenu>
									<DropdownMenuTrigger>
										<Button variant="ghost" size="sm">
											<MoreHorizontal class="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<form
											method="POST"
											action="?/deleteUser"
											use:enhance
										>
											<input type="hidden" name="userId" value={user.id} />
											<DropdownMenuItem>
												<button type="submit" class="text-destructive w-full text-left">
													Delete
												</button>
											</DropdownMenuItem>
										</form>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>
