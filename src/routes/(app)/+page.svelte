<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardFooter } from '$lib/components/ui/card';

	let { data } = $props();
</script>

<main class="min-h-[100vh] w-full px-8 py-4">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Courses</h1>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each data.courses as course}
			<Card
				class="group overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg"
			>
				<CardContent class="p-6">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="text-2xl font-bold tracking-tight group-hover:text-primary">
							{course.name}
						</h2>
						<span class="rounded-full bg-muted px-3 py-1 text-sm font-medium">
							{course.chapterCount}
							{course.chapterCount === 1 ? 'capitol' : 'capitole'}
						</span>
					</div>
				</CardContent>
				<CardFooter class="border-t bg-muted/50 p-4">
					<Button
						href="/course/{course.id}"
						variant="outline"
						size="sm"
						class="ml-auto group-hover:bg-primary group-hover:text-primary-foreground"
					>
						Incepe
					</Button>
				</CardFooter>
			</Card>
		{/each}
	</div>
</main>
