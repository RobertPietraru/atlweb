<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as m from '$lib/paraglide/messages.js';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
	import SuperDebug, { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	const { form, message, errors } = superForm(data.form);
</script>

	<div class="flex min-h-screen items-center justify-center bg-background">
		<Card class="w-[350px]">
			<CardHeader>
				<CardTitle class="text-center text-2xl font-bold">{m.admin_user_create_title()}</CardTitle>
			</CardHeader>
			<CardContent>
				{#if $message}
					<Alert variant="destructive" class="mb-4">
						<AlertDescription>{$message}</AlertDescription>
					</Alert>
				{/if}
				<form method="POST" class="space-y-4">
					<div class="space-y-2">
						<Label for="username">{m.admin_user_username()}</Label>
						<Input
							id="username"
							name="username"
							type="text"
							aria-invalid={$errors.username ? 'true' : 'false'}
							autocomplete="username"
							required
							bind:value={$form.username}
						/>
						<p class="text-destructive">{$errors.username}</p>
					</div>
					<div class="space-y-2">
						<Label for="email">{m.admin_user_email()}</Label>
						<Input
							id="email"
							name="email"
							type="email"
							aria-invalid={$errors.email ? 'true' : 'false'}
							autocomplete="email"
							required
							bind:value={$form.email}
						/>
						<p class="text-destructive">{$errors.email}</p>
					</div>
					<div class="space-y-2">
						<Label for="password">{m.auth_password_label()}</Label>
						<Input
							id="password"
							name="password"
							type="password"
							aria-invalid={$errors.password ? 'true' : 'false'}
							bind:value={$form.password}
							autocomplete="new-password"
							required
						/>
						<p class="text-destructive">{$errors.password}</p>
					</div>
					<Button type="submit" class="w-full">{m.admin_user_create_button()}</Button>
				</form>
			</CardContent>
			<CardFooter class="flex justify-center">
				<a href="/admin/users" class="text-primary hover:underline">{m.admin_user_back_to_list()}</a>
			</CardFooter>
		</Card>
	</div>