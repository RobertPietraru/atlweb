<script lang="ts">
	import { withSearchParameters } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';
	import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
	import { ArrowUpRightIcon, BookOpenIcon, SearchIcon } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	import { Plus, Search } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	const isMobile = new IsMobile();

	let { data } = $props();
</script>

<main class="min-h-[100vh] w-full">
	<h1 class="mb-8 text-2xl font-bold md:text-3xl">Exercitii</h1>

	<div class="mb-4 mr-4 flex items-center gap-2">
		<div class="flex w-full flex-wrap items-center gap-4">
			<div class="relative flex-1">
				<Input
					type="text"
					placeholder="Filtrează"
					name="search"
					data-test="search-input"
					bind:value={data.search}
					autocomplete="off"
					onkeydown={(e) => {
						if (e.key === 'Enter') {
							goto(
								withSearchParameters(
									new URL(page.url.toString()),
									'search',
									data.search
								).toString(),
								{ invalidateAll: true }
							);
						}
					}}
				/>
				<Input type="hidden" name="oldUrl" value={page.url.toString()} />
				<Button
					class="absolute right-0 top-1/2 -translate-y-1/2"
					variant="ghost"
					id="search-button"
					href={withSearchParameters(
						new URL(page.url.toString()),
						'search',
						data.search
					).toString()}
					data-test="search-button"
				>
					<Search />
				</Button>
			</div>
			<Button type="submit" href="/admin/exercises/create" data-test="create-exercise-button">
				<Plus />
				{#if !isMobile.current}
					Creeaza exercitiu nou
				{/if}
			</Button>
		</div>
	</div>

	<div class="space-y-4">
		{#each data.exercises as exercise}
			<a href="/admin/exercises/{exercise.id}" class="block">
				<Card
					class="group cursor-pointer border-2 transition-all hover:scale-[1.01] hover:border-primary hover:shadow-md"
				>
					<CardContent class="p-4">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div class="rounded-full bg-primary/10 p-2">
									<BookOpenIcon class="h-5 w-5 text-primary" />
								</div>
								<div>
									<h2 class="text-xl font-semibold group-hover:text-primary">
										{exercise.title}
									</h2>
									<p class="text-sm text-muted-foreground">{exercise.summary}</p>
								</div>
							</div>
							<div class="flex items-center gap-2">
								<Button
									variant="outline"
									class="group-hover:bg-primary group-hover:text-primary-foreground"
								>
									Editeaza
									<ArrowUpRightIcon class="ml-2 h-4 w-4" />
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</a>
		{/each}

		{#if data.exercises.length === 0}
			<div class="flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
				<p class="text-muted-foreground">Nu s-au gasit exercitii care sa corespunda cautarii</p>
			</div>
		{/if}
	</div>
</main>
