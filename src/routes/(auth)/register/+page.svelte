<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
	import { register } from './register.remote';
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
				<CardTitle class="text-center text-2xl font-bold">{m.auth_register_title()}</CardTitle>
			</CardHeader>
			<CardContent>
				<form {...register} class="space-y-4">
					<input type="hidden" name="redirectUrl" value={data.redirectUrl} />
					<div class="space-y-2">
						<Label for="username">{m.auth_username_label()}</Label>
						<Input
							id="username"
							{...register.fields.username.as('text')}
							autocomplete="username"
							required
						/>
						{#each register.fields.username.issues() as issue}
							<p class="text-destructive">{issue.message}</p>
						{/each}
					</div>
					<div class="space-y-2">
						<Label for="email">{m.auth_email_label()}</Label>
						<Input
							id="email"
							{...register.fields.email.as('email')}
							autocomplete="email"
							required
						/>
						{#each register.fields.email.issues() as issue}
							<p class="text-destructive">{issue.message}</p>
						{/each}
					</div>
					<div class="space-y-2">
						<Label for="_password">{m.auth_password_label()}</Label>
						<Input
							id="_password"
							{...register.fields._password.as('password')}
							autocomplete="new-password"
							required
						/>
						{#each register.fields._password.issues() as issue}
							<p class="text-destructive">{issue.message}</p>
						{/each}
					</div>
					<Button type="submit" class="w-full">{m.auth_register_button()}</Button>
				</form>
			</CardContent>
			<CardFooter class="flex justify-center">
				<p class="text-center">{m.auth_has_account()} <a href="/login" class="text-primary hover:underline">{m.auth_login_link()}</a></p>
			</CardFooter>
		</Card>
	</div>
</main>
