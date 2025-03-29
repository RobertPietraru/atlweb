<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardFooter } from '$lib/components/ui/card';

	let { data } = $props();
</script>

<main class="min-h-[100vh] w-full px-8 py-4">
	<div class="mb-8 space-y-4">
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold">{data.course.name}</h1>
			<Button href="/" variant="outline" size="sm">Înapoi la cursuri</Button>
		</div>
		<p class="text-lg text-muted-foreground">{data.course.description}</p>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each data.course.chapters as chapter}
			<Card
				class="group overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg"
			>
				<CardContent class="p-6">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="text-2xl font-bold tracking-tight group-hover:text-primary">
							{chapter.name}
						</h2>
					</div>
					<p class="text-sm text-muted-foreground">{chapter.description}</p>
				</CardContent>
				<CardFooter class="border-t bg-muted/50 p-4">
					<p class="text-sm text-muted-foreground">
						{#if chapter.lessonCount > 1}
							{chapter.lessonCount} Lecții
						{:else if chapter.lessonCount === 1}
							O Lecție
						{/if}
					</p>
					<Button
						href="/course/{data.course.id}/chapter/{chapter.id}"
						variant="outline"
						size="sm"
						class="ml-auto group-hover:bg-primary group-hover:text-primary-foreground"
					>
						Începe capitolul
					</Button>
				</CardFooter>
			</Card>
		{/each}
	</div>
</main>
