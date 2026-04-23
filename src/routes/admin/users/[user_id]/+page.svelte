<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as m from '$lib/paraglide/messages.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { updateUser, updatePermissions, deleteUser } from './user.remote';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	let selectedPermissions = $state<string[]>([...data.user.permissions]);
	let updatingPermissions = $state(false);
	let deleting = $state(false);
	let isLoading = $derived(updatingPermissions || deleting);

	const groupedPermissions: Record<string, string[]> = data.allPermissions.reduce(
		(acc: Record<string, string[]>, permission: string) => {
			const category = permission.split('.')[0];
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(permission);
			return acc;
		},
		{} as Record<string, string[]>
	);

	async function handleUpdatePermissions() {
		updatingPermissions = true;
		try {
			await updatePermissions({ userId: data.user.id, permissions: selectedPermissions });
			toast.success('Permissions updated');
		} catch {
			toast.error('Failed to update permissions');
		} finally {
			updatingPermissions = false;
		}
	}

	async function handleDeleteUser() {
		deleting = true;
		try {
			await deleteUser({ userId: data.user.id });
		} catch {
			toast.error('Failed to delete user');
			deleting = false;
		}
	}

	function togglePermission(permission: string) {
		if (selectedPermissions.includes(permission)) {
			selectedPermissions = selectedPermissions.filter((p) => p !== permission);
		} else {
			selectedPermissions = [...selectedPermissions, permission];
		}
	}
</script>

<div class="py-8">
	<h1 class="mb-8 text-3xl font-bold">{m.admin_user_edit_title({ username: data.user.username })}</h1>

	<div class="grid gap-8 md:grid-cols-2">
		<div>
			<h2 class="mb-4 text-xl font-semibold">{m.admin_user_basic_info()}</h2>
			<form {...updateUser} class="space-y-4">
				<input type="hidden" name="userId" value={data.user.id} />
				<div class="space-y-2">
					<Label for="username">{m.admin_user_username()}</Label>
					<Input
						id="username"
						{...updateUser.fields.username.as('text')}
						disabled={isLoading}
					/>
					{#each updateUser.fields.username.issues() as issue}
						<p class="text-destructive">{issue.message}</p>
					{/each}
				</div>

				<div class="space-y-2">
					<Label for="email">{m.admin_user_email()}</Label>
					<Input
						id="email"
						{...updateUser.fields.email.as('email')}
						disabled={isLoading}
					/>
					{#each updateUser.fields.email.issues() as issue}
						<p class="text-destructive">{issue.message}</p>
					{/each}
				</div>

				<Button type="submit" disabled={isLoading}>
					{m.admin_user_update_info()}
				</Button>
			</form>

			<div class="mt-8">
				<Button
					variant="destructive"
					disabled={isLoading}
					onclick={handleDeleteUser}
				>
					{#if deleting}
						{m.admin_user_delete_loading()}
					{:else}
						{m.admin_user_delete()}
					{/if}
				</Button>
			</div>
		</div>

		<div>
			<h2 class="mb-4 text-xl font-semibold">{m.admin_user_permissions()}</h2>
			<div class="space-y-6">
				{#each Object.entries(groupedPermissions) as [category, permissions]}
					<div class="space-y-2">
						<h3 class="font-medium capitalize">{category}</h3>
						<div class="grid grid-cols-2 gap-2">
							{#each permissions as permission}
								<div class="flex items-center space-x-2">
									<Checkbox
										id={permission}
										disabled={updatingPermissions}
										checked={selectedPermissions.includes(permission)}
										onCheckedChange={() => togglePermission(permission)}
									/>
									<Label for={permission}>{permission}</Label>
								</div>
							{/each}
						</div>
					</div>
				{/each}

				<Button onclick={handleUpdatePermissions} disabled={isLoading}>
					{#if updatingPermissions}
						{m.admin_user_update_permissions_loading()}
					{:else}
						{m.admin_user_update_permissions()}
					{/if}
				</Button>
			</div>
		</div>
	</div>
</div>
