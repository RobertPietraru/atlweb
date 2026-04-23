<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { ArrowUpRightIcon, BookOpenIcon } from '@lucide/svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';

	let { data } = $props();
</script>

<div class="mx-auto max-w-[1280px] px-6 py-10">
	<!-- Breadcrumb -->
	<Breadcrumb.Root class="mb-6">
		<Breadcrumb.List>
			<Breadcrumb.Separator />
			{#each data.breadcrumbs as crumb, i}
				<Breadcrumb.Item>
					<Breadcrumb.Link href={crumb.url}>{crumb.name}</Breadcrumb.Link>
				</Breadcrumb.Item>
				{#if i < data.breadcrumbs.length - 1}
					<Breadcrumb.Separator />
				{/if}
			{/each}
		</Breadcrumb.List>
	</Breadcrumb.Root>

	<!-- Page header -->
	<div class="mb-10">
		<h1 class="font-display text-3xl font-bold text-foreground md:text-4xl">
			{m.courses_title()}
		</h1>
		<p class="mt-2 text-muted-foreground">{m.home_interactive_courses_description()}</p>
	</div>

	<!-- Course grid -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.courses as course}
			<a href="/courses/{course.id}" class="group block h-full">
				<article
					class="flex h-full flex-col rounded-xl border bg-card shadow-sm transition-all duration-200 hover:border-primary hover:shadow-md"
				>
					<!-- Card top accent bar -->
					<div class="h-1 w-full rounded-t-xl bg-gradient-to-r from-primary to-blue-400"></div>

					<div class="flex flex-1 flex-col p-6">
						<!-- Icon + Title row -->
						<div class="mb-3 flex items-start justify-between gap-3">
							<div class="flex items-center gap-3">
								<div class="shrink-0 rounded-lg bg-primary/10 p-2.5">
									<BookOpenIcon class="h-5 w-5 text-primary" />
								</div>
								<h2
									class="font-display text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary"
								>
									{course.name}
								</h2>
							</div>
							<div
								class="mt-0.5 shrink-0 rounded-full bg-primary/10 p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<ArrowUpRightIcon class="h-3.5 w-3.5 text-primary" />
							</div>
						</div>

						<!-- Description -->
						<p class="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
							{course.description}
						</p>

						<!-- Footer -->
						<div class="flex items-center justify-between border-t pt-4">
							<span class="flex items-center gap-1.5 text-xs text-muted-foreground">
								<BookOpenIcon class="h-3.5 w-3.5" />
								{course.chapterCount}
								{course.chapterCount === 1 ? m.courses_chapter_singular() : m.courses_chapter_plural()}
							</span>
							<span
								class="rounded-md bg-primary/10 px-3 py-1 font-display text-xs font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
							>
								{m.courses_start()}
							</span>
						</div>
					</div>
				</article>
			</a>
		{/each}
	</div>
</div>
