<script lang="ts">
	import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
	import { ArrowUpRightIcon, BookOpenIcon, PlayIcon } from 'lucide-svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	const isMobile = new IsMobile();
	let { data } = $props();
</script>

<main class="min-h-[100vh] w-full py-4">
	<div class="mb-8 space-y-4 px-4 md:px-8">
		<div class="flex items-center gap-2">
			<a class="flex items-center gap-2 text-2xl font-bold md:text-3xl hover:text-primary transition-colors" href="../courses">
				<ArrowUpRightIcon class="h-4 w-4 rotate-180" />
				{data.course.name}
			</a>
		</div>
		<p class="text-lg text-muted-foreground">{data.course.description}</p>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:px-8 lg:grid-cols-3">
		{#each data.course.chapters as chapter}
			<a href="/course/{data.course.id}/chapter/{chapter.id}" class="h-full">
				<Card
					class="group flex h-full cursor-pointer flex-col overflow-hidden border-2 transition-all hover:scale-[1.02] hover:border-primary hover:shadow-lg"
				>
					<CardContent class="flex-grow p-6">
						<div class="mb-4 flex items-center justify-between">
							<div class="flex items-center gap-2">
								<div class="rounded-full bg-primary/10 p-2">
									<BookOpenIcon class="h-5 w-5 text-primary" />
								</div>
								<h2 class="text-2xl font-bold tracking-tight group-hover:text-primary">
									{chapter.name}
								</h2>
							</div>
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<ArrowUpRightIcon class="h-4 w-4 text-primary" />
							</div>
						</div>
						<p class="text-sm text-muted-foreground">{chapter.description}</p>
					</CardContent>
					<CardFooter class="border-t bg-muted/50 p-4">
						<div class="flex w-full items-center justify-between">
							<div class="flex items-center gap-2">
								<div class="flex items-center gap-1 text-sm text-muted-foreground">
									<BookOpenIcon class="h-4 w-4" />
									<span>
										{chapter.lessonCount}
										{chapter.lessonCount === 1 ? 'lecție' : 'lecții'}
									</span>
								</div>
							</div>
							<div
								class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-hover:bg-primary group-hover:text-primary-foreground"
							>
								Începe capitolul
							</div>
						</div>
					</CardFooter>
				</Card>
			</a>
		{/each}
	</div>
</main>
