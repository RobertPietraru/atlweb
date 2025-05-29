<script lang="ts">
	import { withSearchParameters } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Plus, Search, Loader2, ArrowUpRightIcon, BookOpenIcon } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	const isMobile = new IsMobile();

	let { data } = $props();
	let loading = $state(false);
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
			<form
				action="?/create"
				method="post"
				onsubmit={() => {
					loading = true;
				}}
			>
				<Button type="submit" disabled={loading} data-test="create-exercise-button">
					{#if loading}
						<Loader2 class="size-4 animate-spin" />
					{:else}
						<Plus />
					{/if}
					{#if !isMobile.current}
						Creeaza exercitiu nou
					{/if}
				</Button>
			</form>
		</div>
	</div>

	<div class="space-y-4">
		{#each data.exercises as exercise}
			<a href="/admin/exercises/{exercise.id}" class="block">
				<Card
					class="group flex cursor-pointer items-end justify-between overflow-hidden border-2 transition-all hover:scale-[1.01] hover:border-primary hover:shadow-lg"
				>
					<CardContent class="relative p-6">
						<div class="flex items-start justify-between gap-6">
							<div class="flex items-start gap-4">
								<div class="rounded-xl bg-primary/10 p-3">
									<BookOpenIcon class="h-6 w-6 text-primary" />
								</div>
								<div class="space-y-1">
									<h2
										class="text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary"
									>
										{exercise.title}
									</h2>
									<p class="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
										{exercise.summary}
									</p>
								</div>
							</div>
						</div>
					</CardContent>
					<Button
						variant="outline"
						class="shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
					>
						<ArrowUpRightIcon
							class="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
						/>
					</Button>
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
