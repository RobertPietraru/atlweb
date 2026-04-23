<script lang="ts">
	import { withSearchParameters, localizedGoto } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';
	import { Input } from '$lib/components/ui/input';
	import { Search, ArrowUpRightIcon, BrainCircuitIcon, ChevronLeftIcon, ChevronRightIcon } from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { data } = $props();
</script>

<div class="mx-auto max-w-[1280px] px-6 py-10">
	<!-- Page header -->
	<div class="mb-8">
		<h1 class="font-display text-3xl font-bold text-foreground md:text-4xl">
			{m.exercises_title()}
		</h1>
		<p class="mt-2 text-muted-foreground">{m.home_practical_exercises_description()}</p>
	</div>

	<!-- Search bar -->
	<div class="mb-8">
		<div class="relative max-w-lg">
			<Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="text"
				placeholder={m.exercises_filter_placeholder()}
				name="search"
				data-test="search-input"
				bind:value={data.search}
				autocomplete="off"
				class="pl-10 pr-24"
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						localizedGoto(
							page.url.toString(),
							withSearchParameters(
								withSearchParameters(new URL(page.url.toString()), 'search', data.search),
								'page',
								'1'
							).toString(),
							{ invalidateAll: true }
						);
					}
				}}
			/>
			<Button
				class="absolute right-1 top-1/2 h-8 -translate-y-1/2 px-3 font-display text-xs font-semibold"
				id="search-button"
				href={withSearchParameters(new URL(page.url.toString()), 'search', data.search).toString()}
				data-test="search-button"
			>
				{m.exercises_filter_placeholder().split(' ')[0]}
			</Button>
		</div>
	</div>

	<!-- Exercise list -->
	<div class="space-y-4">
		{#if data.exercises.length === 0}
			<div
				class="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 text-center"
			>
				<BrainCircuitIcon class="mb-3 h-10 w-10 text-muted-foreground/50" />
				<p class="font-display font-medium text-muted-foreground">{m.exercises_no_results()}</p>
			</div>
		{:else}
			{#each data.exercises as exercise}
				<a href="/exercises/{exercise.id}" class="group block">
					<article
						class="flex items-center justify-between overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:border-primary hover:shadow-md"
					>
						<div class="flex items-start gap-4 p-6">
							<div class="shrink-0 rounded-xl bg-primary/10 p-3">
								<BrainCircuitIcon class="h-5 w-5 text-primary" />
							</div>
							<div>
								<h2
									class="font-display text-lg font-semibold text-foreground transition-colors group-hover:text-primary"
								>
									{exercise.title}
								</h2>
								<p class="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
									{exercise.summary}
								</p>
							</div>
						</div>
						<div class="shrink-0 pr-6">
							<div
								class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
							>
								<ArrowUpRightIcon class="h-4 w-4 text-primary transition-colors group-hover:text-primary-foreground" />
							</div>
						</div>
					</article>
				</a>
			{/each}
		{/if}
	</div>

	<!-- Pagination -->
	{#if data.pagesLeft > 1}
		<nav class="mt-8 flex items-center justify-center gap-1">
			<Button
				href={withSearchParameters(new URL(page.url.toString()), 'page', (data.page - 1).toString()).toString()}
				variant="outline"
				size="icon"
				class={data.page === 0 ? 'pointer-events-none opacity-40' : ''}
			>
				<ChevronLeftIcon class="h-4 w-4" />
				<span class="sr-only">{m.exercises_previous_page()}</span>
			</Button>

			{#each Array(data.pagesLeft) as _, i}
				{#if i === 0 || i === data.pagesLeft - 1 || (i >= data.page - 1 && i <= data.page + 1)}
					<a
						href={withSearchParameters(new URL(page.url.toString()), 'page', (i + 1).toString()).toString()}
						class="inline-flex h-9 w-9 items-center justify-center rounded-md border font-display text-sm font-medium transition-colors
							{data.page === i ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:border-primary hover:text-primary'}"
					>
						{i + 1}
					</a>
				{:else if i === data.page - 2 || i === data.page + 2}
					<span class="flex h-9 w-9 items-center justify-center text-muted-foreground">…</span>
				{/if}
			{/each}

			<Button
				href={withSearchParameters(new URL(page.url.toString()), 'page', (data.page + 2).toString()).toString()}
				variant="outline"
				size="icon"
				class={data.page === data.pagesLeft - 1 ? 'pointer-events-none opacity-40' : ''}
			>
				<ChevronRightIcon class="h-4 w-4" />
				<span class="sr-only">{m.exercises_next_page()}</span>
			</Button>
		</nav>
	{/if}
</div>
