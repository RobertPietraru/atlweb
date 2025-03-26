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

<main class="min-h-[100vh] w-full px-8 py-4">
	<nav class="flex items-center justify-between">
		<a class="text-3xl font-bold" href="/">ATLWEB</a>
	</nav>

	<div class="flex min-h-screen items-center justify-center bg-background">
		<Card class="w-[350px]">
			<CardHeader>
				<CardTitle class="text-center text-2xl font-bold">Autentifică-te</CardTitle>
			</CardHeader>
			<CardContent>
				{#if $message}
					<Alert variant="destructive" class="mb-4">
						<AlertDescription>{$message}</AlertDescription>
					</Alert>
				{/if}
				<form method="POST" class="space-y-4">
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
							autocomplete="current-password"
							required
						/>
						<p class="text-destructive">{$errors.password}</p>
					</div>
					<Button type="submit" class="w-full">Autentifică-te</Button>
				</form>
			</CardContent>
			<CardFooter class="flex justify-center">
				<p class="text-center">Nu ai cont? <a href="/register" class="text-blue-500 hover:underline">Înregistrează-te</a></p>
			</CardFooter>
		</Card>
	</div>
</main>
