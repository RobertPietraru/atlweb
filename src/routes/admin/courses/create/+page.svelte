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
				<CardTitle class="text-center text-2xl font-bold">Creează curs</CardTitle>
			</CardHeader>
			<CardContent>
				{#if $message}
					<Alert variant="destructive" class="mb-4">
						<AlertDescription>{$message}</AlertDescription>
					</Alert>
				{/if}
				<form method="POST" class="space-y-4">
					<div class="space-y-2">
						<Label for="name">Nume curs</Label>
						<Input
							id="name"
							name="name"
							type="text"
							aria-invalid={$errors.name ? 'true' : 'false'}
							required
							bind:value={$form.name}
						/>
						<p class="text-destructive">{$errors.name}</p>
					</div>
					<div class="space-y-2">
						<Label for="description">Descriere</Label>
						<Input
							id="description"
							name="description"
							type="text"
							aria-invalid={$errors.description ? 'true' : 'false'}
							required
							bind:value={$form.description}
						/>
						<p class="text-destructive">{$errors.description}</p>
					</div>
					<Button type="submit" class="w-full">Creează curs</Button>
				</form>
			</CardContent>
			<CardFooter class="flex justify-center">
				<a href="/admin/courses" class="text-primary hover:underline">Inapoi la lista de cursuri</a>
			</CardFooter>
		</Card>
	</div>