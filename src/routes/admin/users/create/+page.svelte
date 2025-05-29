<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
	import SuperDebug, { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	const { form, message, errors } = superForm(data.form);
</script>

	<div class="flex min-h-screen items-center justify-center bg-background">
		<Card class="w-[350px]">
			<CardHeader>
				<CardTitle class="text-center text-2xl font-bold">Creează utilizator</CardTitle>
			</CardHeader>
			<CardContent>
				{#if $message}
					<Alert variant="destructive" class="mb-4">
						<AlertDescription>{$message}</AlertDescription>
					</Alert>
				{/if}
				<form method="POST" class="space-y-4">
					<div class="space-y-2">
						<Label for="username">Nume de utilizator</Label>
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
						<Label for="email">Adresa de email</Label>
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
						<Label for="password">Parola</Label>
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
					<Button type="submit" class="w-full">Creează utilizator</Button>
				</form>
			</CardContent>
			<CardFooter class="flex justify-center">
				<a href="/admin/users" class="text-primary hover:underline">Inapoi la lista de utilizatori</a>
			</CardFooter>
		</Card>
	</div>