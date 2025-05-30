<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as m from '$lib/paraglide/messages.js';
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
				<CardTitle class="text-center text-2xl font-bold">{m.admin_course_create_title()}</CardTitle>
			</CardHeader>
			<CardContent>
				{#if $message}
					<Alert variant="destructive" class="mb-4">
						<AlertDescription>{$message}</AlertDescription>
					</Alert>
				{/if}
				<form method="POST" class="space-y-4">
					<div class="space-y-2">
						<Label for="name">{m.admin_course_name()}</Label>
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
						<Label for="description">{m.admin_course_description()}</Label>
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
					<Button type="submit" class="w-full">{m.admin_course_create_button()}</Button>
				</form>
			</CardContent>
			<CardFooter class="flex justify-center">
				<a href="/admin/courses" class="text-primary hover:underline">{m.admin_course_back_to_list()}</a>
			</CardFooter>
		</Card>
	</div>