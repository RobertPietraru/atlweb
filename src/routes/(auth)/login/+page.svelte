<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
	import { login } from './login.remote';
	import * as m from '$lib/paraglide/messages.js';

	let { data } = $props();
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
				<form {...login} class="space-y-4">
					<input type="hidden" name="redirectUrl" value={data.redirectUrl} />
					<div class="space-y-2">
						<Label for="email">{m.auth_email_label()}</Label>
						<Input
							id="email"
							{...login.fields.email.as('email')}
							autocomplete="email"
							required
						/>
						{#each login.fields.email.issues() as issue}
							<p class="text-destructive">{issue.message}</p>
						{/each}
					</div>
					<div class="space-y-2">
						<Label for="_password">{m.auth_password_label()}</Label>
						<Input
							id="_password"
							{...login.fields._password.as('password')}
							autocomplete="current-password"
							required
						/>
						{#each login.fields._password.issues() as issue}
							<p class="text-destructive">{issue.message}</p>
						{/each}
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
