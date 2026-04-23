<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as m from '$lib/paraglide/messages.js';
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
	import { createUser } from './create.remote';
	import { Loader2Icon } from '@lucide/svelte';
	import { enhance } from '$app/forms';

	let submitting = $state(false);
</script>

<div class="flex min-h-screen items-center justify-center bg-background">
	<Card class="w-[350px]">
		<CardHeader>
			<CardTitle class="text-center text-2xl font-bold">{m.admin_user_create_title()}</CardTitle>
		</CardHeader>
		<CardContent>
			<form
				{...createUser}
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						await update();
						submitting = false;
					};
				}}
				class="space-y-4"
			>
				<div class="space-y-2">
					<Label for="username">{m.admin_user_username()}</Label>
					<Input
						id="username"
						{...createUser.fields.username.as('text')}
						autocomplete="username"
						disabled={submitting}
						required
					/>
					{#each createUser.fields.username.issues() as issue}
						<p class="text-xs text-destructive">{issue.message}</p>
					{/each}
				</div>
				<div class="space-y-2">
					<Label for="email">{m.admin_user_email()}</Label>
					<Input
						id="email"
						{...createUser.fields.email.as('email')}
						autocomplete="email"
						disabled={submitting}
						required
					/>
					{#each createUser.fields.email.issues() as issue}
						<p class="text-xs text-destructive">{issue.message}</p>
					{/each}
				</div>
				<div class="space-y-2">
					<Label for="_password">{m.auth_password_label()}</Label>
					<Input
						id="_password"
						{...createUser.fields._password.as('password')}
						autocomplete="new-password"
						disabled={submitting}
						required
					/>
					{#each createUser.fields._password.issues() as issue}
						<p class="text-xs text-destructive">{issue.message}</p>
					{/each}
				</div>
				<Button type="submit" class="w-full gap-2" disabled={submitting}>
					{#if submitting}
						<Loader2Icon class="h-4 w-4 animate-spin" />
					{/if}
					{submitting ? m.admin_user_create_loading() : m.admin_user_create_button()}
				</Button>
			</form>
		</CardContent>
		<CardFooter class="flex justify-center">
			<a href="/admin/users" class="text-primary hover:underline">{m.admin_user_back_to_list()}</a>
		</CardFooter>
	</Card>
</div>
