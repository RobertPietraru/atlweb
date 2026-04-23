<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as m from '$lib/paraglide/messages.js';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
	import { createCourse } from './create.remote';
</script>

<div class="flex min-h-screen items-center justify-center bg-background">
	<Card class="w-[350px]">
		<CardHeader>
			<CardTitle class="text-center text-2xl font-bold">{m.admin_course_create_title()}</CardTitle>
		</CardHeader>
		<CardContent>
			<form {...createCourse} class="space-y-4">
				<div class="space-y-2">
					<Label for="name">{m.admin_course_name()}</Label>
					<Input
						id="name"
						{...createCourse.fields.name.as('text')}
						required
					/>
					{#each createCourse.fields.name.issues() as issue}
						<p class="text-destructive">{issue.message}</p>
					{/each}
				</div>
				<div class="space-y-2">
					<Label for="description">{m.admin_course_description()}</Label>
					<Input
						id="description"
						{...createCourse.fields.description.as('text')}
						required
					/>
					{#each createCourse.fields.description.issues() as issue}
						<p class="text-destructive">{issue.message}</p>
					{/each}
				</div>
				<Button type="submit" class="w-full">{m.admin_course_create_button()}</Button>
			</form>
		</CardContent>
		<CardFooter class="flex justify-center">
			<a href="/admin/courses" class="text-primary hover:underline">{m.admin_course_back_to_list()}</a>
		</CardFooter>
	</Card>
</div>
