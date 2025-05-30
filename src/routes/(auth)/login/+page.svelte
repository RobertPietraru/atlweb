<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import * as m from '$lib/paraglide/messages.js';

	let { data } = $props();
	const { form, message, errors } = superForm(data.form);
</script>

<main class="min-h-[100vh] w-full px-8 py-4">
	<nav class="flex items-center justify-between">
		<a class="text-3xl font-bold" href="/">{m.brand_name()}</a>
	</nav>

	<div class="flex min-h-screen items-center justify-center bg-background">
		<Card class="w-[350px]">
			<CardHeader>
				<CardTitle class="text-center text-2xl font-bold">{m.auth_login_title()}</CardTitle>
			</CardHeader>
			<CardContent>
				{#if $message}
					<Alert variant="destructive" class="mb-4">
						<AlertDescription>{$message}</AlertDescription>
					</Alert>
				{/if}
				<form method="POST" class="space-y-4">
					<div class="space-y-2">
						<Label for="email">{m.auth_email_label()}</Label>
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
							autocomplete="current-password"
							required
						/>
						<p class="text-destructive">{$errors.password}</p>
					</div>
					<Button type="submit" class="w-full">{m.auth_login_button()}</Button>
				</form>
			</CardContent>
			<CardFooter class="flex justify-center">
				<p class="text-center">{m.auth_no_account()} <a href="/register?redirect={data.redirectUrl}" class="text-blue-500 hover:underline">{m.auth_register_link()}</a></p>
			</CardFooter>
		</Card>
	</div>
</main>
