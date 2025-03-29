<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
	import { ArrowUpRightIcon, BookOpenIcon, PlayIcon } from 'lucide-svelte';

	let { data } = $props();
</script>

<main class="min-h-[100vh] w-full px-8 py-4">
	<div class="mb-8 space-y-4">
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold">{data.chapter.name}</h1>
			<Button href="/course/{data.courseId}" variant="outline" size="sm">Înapoi la capitole</Button>
		</div>
		<p class="text-lg text-muted-foreground">{data.chapter.description}</p>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each data.chapter.lessons as lesson}
			<a href="/course/{data.courseId}/chapter/{data.chapter.id}/lesson/{lesson.id}" class="h-full">
				<Card
					class="group h-full cursor-pointer overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg hover:scale-[1.02] flex flex-col"
				>
					<CardContent class="p-6 flex-grow">
						<div class="mb-4 flex items-center justify-between">
							<div class="flex items-center gap-2">
								<div class="rounded-full bg-primary/10 p-2">
									<BookOpenIcon class="h-5 w-5 text-primary" />
								</div>
								<h2 class="text-2xl font-bold tracking-tight group-hover:text-primary">
									{lesson.name}
								</h2>
							</div>
							<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100">
								<ArrowUpRightIcon class="h-4 w-4 text-primary" />
							</div>
						</div>
						<p class="text-sm text-muted-foreground">{lesson.teaser}</p>
					</CardContent>
					<CardFooter class="border-t bg-muted/50 p-4">
						<div class="flex w-full items-center justify-between">
							<div class="flex items-center gap-2">
								<div class="flex items-center gap-1 text-sm text-muted-foreground">
									<PlayIcon class="h-4 w-4" />
									<span>Lecția {lesson.order + 1}</span>
								</div>
							</div>
							<div class="group-hover:bg-primary group-hover:text-primary-foreground inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
								Începe lecția
							</div>
						</div>
					</CardFooter>
				</Card>
			</a>
		{/each}
	</div>
</main>
