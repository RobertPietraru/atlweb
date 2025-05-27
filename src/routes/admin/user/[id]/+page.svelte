<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();
	const {
		form: updateForm,
		errors: updateErrors,
		message: updateMessage
	} = superForm(data.updateForm);
	const { form: permissionsForm } = superForm(data.permissionsForm);

	let updatingUser = $state(false);
	let updatingPermissions = $state(false);
	let deleting = $state(false);
	let isLoading = $derived(updatingUser || updatingPermissions || deleting);

	// Group permissions by category
	const groupedPermissions = data.allPermissions.reduce(
		(acc: Record<string, string[]>, permission: string) => {
			const category = permission.split('.')[0];
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(permission);
			return acc;
		},
		{}
	);
</script>

<div class="py-8">
	<h1 class="mb-8 text-3xl font-bold">Editează utilizator: {$updateForm.username}</h1>

	{#if $updateMessage}
		<Alert variant="destructive" class="mb-4">
			<AlertDescription>{$updateMessage}</AlertDescription>
		</Alert>
	{/if}

	<div class="grid gap-8 md:grid-cols-2">
		<div>
			<h2 class="mb-4 text-xl font-semibold">Informații de bază</h2>
			<form
				method="POST"
				action="?/updateUser"
				class="space-y-4"
				use:enhance={() => {
					updatingUser = true;
					return async ({ update }) => {
						await update();
						updatingUser = false;
					};
				}}
			>
				<div class="space-y-2">
					<Label for="username">Nume de utilizator</Label>
					<Input
						id="username"
						name="username"
						type="text"
						disabled={isLoading}
						aria-invalid={$updateErrors.username ? 'true' : 'false'}
						bind:value={$updateForm.username}
					/>
					<p class="text-destructive">{$updateErrors.username}</p>
				</div>

				<div class="space-y-2">
					<Label for="email">Adresa de email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						disabled={isLoading}
						aria-invalid={$updateErrors.email ? 'true' : 'false'}
						bind:value={$updateForm.email}
					/>
					<p class="text-destructive">{$updateErrors.email}</p>
				</div>

				<Button type="submit" disabled={isLoading}>
					{#if updatingUser}
						Actualizare în curs...
					{:else}
						Actualizează informațiile
					{/if}
				</Button>
			</form>

			<form
				method="POST"
				action="?/deleteUser"
				class="mt-8"
				use:enhance={() => {
					deleting = true;
					return async ({ update }) => {
						await update();
						deleting = false;
					};
				}}
			>
				<Button type="submit" variant="destructive" disabled={isLoading}>
					{#if deleting}
						Ștergere în curs...
					{:else}
						Șterge utilizatorul
					{/if}
				</Button>
			</form>
		</div>

		<div>
			<h2 class="mb-4 text-xl font-semibold">Permisiuni</h2>
			<form
				method="POST"
				action="?/updatePermissions"
				class="space-y-6"
				use:enhance={() => {
					updatingPermissions = true;
					return async ({ update }) => {
						await update();
						await invalidateAll();
						updatingPermissions = false;
					};
				}}
			>
				{#each Object.entries(groupedPermissions) as [category, permissions]}
					<div class="space-y-2">
						<h3 class="font-medium capitalize">{category}</h3>
						<div class="grid grid-cols-2 gap-2">
							{#each permissions as permission}
								<div class="flex items-center space-x-2">
									<Checkbox
										id={permission}
										name="permissions"
										value={permission}
										disabled={updatingPermissions}
										checked={$permissionsForm.permissions.includes(permission)}
									/>
									<Label for={permission}>{permission}</Label>
								</div>
							{/each}
						</div>
					</div>
				{/each}

				<Button type="submit" disabled={isLoading}>
					{#if updatingPermissions}
						Actualizare în curs...
					{:else}
						Actualizează permisiunile
					{/if}
				</Button>
			</form>
		</div>
	</div>
</div>
