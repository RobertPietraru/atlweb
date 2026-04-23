<script lang="ts">
	import { ArrowUpRightIcon, BookOpenIcon, PlayIcon } from '@lucide/svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as m from '$lib/paraglide/messages.js';

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

	<!-- Chapter header -->
	<div class="mb-10 rounded-xl border bg-card p-8 shadow-sm">
		<div class="flex items-start gap-4">
			<div class="shrink-0 rounded-xl bg-primary/10 p-4">
				<BookOpenIcon class="h-7 w-7 text-primary" />
			</div>
			<div>
				<h1 class="font-display text-3xl font-bold text-foreground md:text-4xl">
					{data.chapter.name}
				</h1>
				<p class="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
					{data.chapter.description}
				</p>
			</div>
		</div>
	</div>

	<!-- Lessons grid -->
	<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.chapter.lessons as lesson, index}
			<a
				href="/courses/{data.courseId}/chapters/{data.chapter.id}/lessons/{lesson.id}"
				class="group block h-full"
			>
				<article
					class="flex h-full flex-col rounded-xl border bg-card shadow-sm transition-all duration-200 hover:border-primary hover:shadow-md"
				>
					<div class="flex flex-1 flex-col p-6">
						<!-- Lesson number + title -->
						<div class="mb-3 flex items-start justify-between gap-3">
							<div class="flex items-center gap-3">
								<span
									class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 font-display text-xs font-bold text-primary group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
								>
									{index + 1}
								</span>
								<h2
									class="font-display text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary"
								>
									{lesson.name}
								</h2>
							</div>
							<div
								class="mt-0.5 shrink-0 rounded-full bg-primary/10 p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<ArrowUpRightIcon class="h-3.5 w-3.5 text-primary" />
							</div>
						</div>

						<p class="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
							{lesson.teaser}
						</p>

						<div class="flex items-center justify-between border-t pt-4">
							<span class="flex items-center gap-1.5 text-xs text-muted-foreground">
								<PlayIcon class="h-3.5 w-3.5" />
								{m.chapter_lesson_number({ nr: lesson.order + 1 })}
							</span>
							<span
								class="rounded-md bg-primary/10 px-3 py-1 font-display text-xs font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
							>
								{m.chapter_lesson_start()}
							</span>
						</div>
					</div>
				</article>
			</a>
		{/each}
	</div>
</div>
