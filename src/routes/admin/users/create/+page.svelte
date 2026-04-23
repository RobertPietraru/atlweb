<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as m from '$lib/paraglide/messages.js';
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
	import { createUser } from './create.remote';
</script>

<div class="flex min-h-screen items-center justify-center bg-background">
	<Card class="w-[350px]">
		<CardHeader>
			<CardTitle class="text-center text-2xl font-bold">{m.admin_user_create_title()}</CardTitle>
		</CardHeader>
		<CardContent>
			<form {...createUser} class="space-y-4">
				<div class="space-y-2">
					<Label for="username">{m.admin_user_username()}</Label>
					<Input
						id="username"
						{...createUser.fields.username.as('text')}
						autocomplete="username"
						required
					/>
					{#each createUser.fields.username.issues() as issue}
						<p class="text-destructive">{issue.message}</p>
					{/each}
				</div>
				<div class="space-y-2">
					<Label for="email">{m.admin_user_email()}</Label>
					<Input
						id="email"
						{...createUser.fields.email.as('email')}
						autocomplete="email"
						required
					/>
					{#each createUser.fields.email.issues() as issue}
						<p class="text-destructive">{issue.message}</p>
					{/each}
				</div>
				<div class="space-y-2">
					<Label for="_password">{m.auth_password_label()}</Label>
					<Input
						id="_password"
						{...createUser.fields._password.as('password')}
						autocomplete="new-password"
						required
					/>
					{#each createUser.fields._password.issues() as issue}
						<p class="text-destructive">{issue.message}</p>
					{/each}
				</div>
				<Button type="submit" class="w-full">{m.admin_user_create_button()}</Button>
			</form>
		</CardContent>
		<CardFooter class="flex justify-center">
			<a href="/admin/users" class="text-primary hover:underline">{m.admin_user_back_to_list()}</a>
		</CardFooter>
	</Card>
</div>
