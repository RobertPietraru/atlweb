<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as m from '$lib/paraglide/messages.js';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
	import { createCourse } from './create.remote';
	import { Loader2Icon } from '@lucide/svelte';
	import { enhance } from '$app/forms';

	let submitting = $state(false);
</script>

<div class="flex min-h-screen items-center justify-center bg-background">
	<Card class="w-[350px]">
		<CardHeader>
			<CardTitle class="text-center text-2xl font-bold">{m.admin_course_create_title()}</CardTitle>
		</CardHeader>
		<CardContent>
			<form
				{...createCourse}
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
					<Label for="name">{m.admin_course_name()}</Label>
					<Input
						id="name"
						{...createCourse.fields.name.as('text')}
						disabled={submitting}
						required
					/>
					{#each createCourse.fields.name.issues() as issue}
						<p class="text-xs text-destructive">{issue.message}</p>
					{/each}
				</div>
				<div class="space-y-2">
					<Label for="description">{m.admin_course_description()}</Label>
					<Input
						id="description"
						{...createCourse.fields.description.as('text')}
						disabled={submitting}
						required
					/>
					{#each createCourse.fields.description.issues() as issue}
						<p class="text-xs text-destructive">{issue.message}</p>
					{/each}
				</div>
				<Button type="submit" class="w-full gap-2" disabled={submitting}>
					{#if submitting}
						<Loader2Icon class="h-4 w-4 animate-spin" />
					{/if}
					{submitting ? m.admin_course_create_loading() : m.admin_course_create_button()}
				</Button>
			</form>
		</CardContent>
		<CardFooter class="flex justify-center">
			<a href="/admin/courses" class="text-primary hover:underline">{m.admin_course_back_to_list()}</a>
		</CardFooter>
	</Card>
</div>
