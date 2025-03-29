<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { marked } from 'marked';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { PlayIcon, ArrowLeftIcon, BookOpenIcon, ArrowRightIcon, MenuIcon } from 'lucide-svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { onMount } from 'svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	const isMobile = new IsMobile();

	let { data } = $props();
	$effect(() => {
		lesson = data.lesson;
		lastRanLessonState = null;
	});
	let lesson = $state(data.lesson);
	let lastRanLessonState: typeof lesson | null = $state(null);
	let showSidebar = $state(false);

	let activeTab = $state<'html' | 'css' | 'js'>('html');

	function getCodePreview(block: Extract<(typeof lesson.blocks)[0], { type: 'code' }>) {
		const css = block.css ?? '';
		const html = block.html ?? '';
		const javascript = block.javascript ?? '';

		let html_content = '';
		html_content += `<ht` + `ml>`;
		html_content += `<he` + `ad>`;
		html_content += `<meta name="viewport" content="width=device-width, initial-scale=1.0">`;
		html_content +=
			`<sty` +
			`le>
			* { box-sizing: border-box; }
			body { margin: 0; padding: 16px; max-width: 100vw; overflow-x: hidden; }
			${css}
		</sty` +
			`le>`;
		html_content += `</he` + `ad>`;
		html_content += `<bo` + `dy>${html}</bo` + `dy>`;
		html_content += `<sc` + `ript>`;
		html_content += `${javascript}</sc` + `ript>`;
		html_content += `</ht` + `ml>`;

		return html_content;
	}
</script>

<div class="flex min-h-screen w-full flex-col lg:flex-row-reverse">
	{#if isMobile.current}
		<div class="flex w-full items-center justify-between border-b bg-card p-4 lg:hidden gap-3">
			<div class="rounded-full bg-primary/10 p-2">
				<BookOpenIcon class="h-5 w-5 text-primary" />
			</div>
			<h1 class="flex-1 text-xl font-bold">{lesson.name || 'Lectie'}</h1>
			<Button variant="ghost" size="icon" onclick={() => (showSidebar = !showSidebar)}>
				<MenuIcon class="h-5 w-5" />
			</Button>
		</div>
	{/if}

	<aside
		class="w-full border-b bg-card lg:w-96 lg:border-b-0 lg:border-l"
		class:hidden={!showSidebar}
		class:lg:block={true}
	>
		<div class="flex flex-col gap-6 p-6">
			<Button href="../" variant="outline" class="w-full">
				<ArrowLeftIcon class="mr-2 h-4 w-4" />
				Înapoi la capitol
			</Button>

			<div class="rounded-xl border bg-muted/50 p-6 shadow-sm">
				<h3 class="mb-2 text-xl font-semibold">Lecții în acest capitol</h3>
				<p class="mb-6 text-sm text-muted-foreground">
					Parcurge toate lecțiile pentru a finaliza acest capitol
				</p>

				<div class="space-y-3">
					{#each data.lessonNamesInChapter as lesson, i}
						<a
							href="./{lesson.id}"
							class="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
							onclick={() => (showSidebar = false)}
						>
							<span
								class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-medium text-primary group-hover:bg-primary/20"
							>
								{i + 1}
							</span>
							<span class="flex-1 font-medium">{lesson.name}</span>
							{#if lesson.id === data.lesson.id}
								<div class="h-2 w-2 rounded-full bg-primary"></div>
							{/if}
						</a>
					{/each}
				</div>
			</div>

			<div class="rounded-xl border bg-muted/50 p-6 shadow-sm">
				<h3 class="mb-2 text-xl font-semibold">Progres</h3>
				<p class="text-sm text-muted-foreground">
					Ai completat {data.lessonNamesInChapter.findIndex((l) => l.id === data.lesson.id) + 1} din
					{data.lessonNamesInChapter.length} lecții
				</p>
				<div class="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
					<div
						class="h-full bg-primary"
						style="width: {((data.lessonNamesInChapter.findIndex((l) => l.id === data.lesson.id) +
							1) /
							data.lessonNamesInChapter.length) *
							100}%"
					></div>
				</div>
			</div>
		</div>
	</aside>

	<main class="w-full flex-1 md:p-8">
		{#if !isMobile.current}
			<div class="mb-2 flex gap-4">
				<div class="flex items-center gap-3">
					<div class="rounded-full bg-primary/10 p-2">
						<BookOpenIcon class="h-5 w-5 text-primary" />
					</div>
					<h1 class="hidden text-3xl font-bold tracking-tight lg:block">
						{lesson.name || 'Lectie'}
					</h1>
				</div>
			</div>
		{/if}
		<div class="markdown-content mb-4 px-4 md:px-0">
			{@html marked(lesson.description)}
		</div>

		<div class="space-y-8">
			{#each lesson.blocks as block, index}
				<div
					class="rounded-lg border-2 bg-muted/50 p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md md:p-6"
				>
					{#if block.type === 'text'}
						{@render textBlock(block)}
					{/if}
					{#if block.type === 'resources'}
						{@render resourcesBlock(block)}
					{/if}
					{#if block.type === 'code'}
						{@render codeBlock(block, index)}
					{/if}
				</div>
			{/each}
		</div>
	</main>
</div>

{#snippet textBlock(block: Extract<(typeof lesson.blocks)[0], { type: 'text' }>)}
	<div class="markdown-content prose prose-slate max-w-none">
		{@html marked(block.text)}
	</div>
{/snippet}

{#snippet resourcesBlock(block: Extract<(typeof lesson.blocks)[0], { type: 'resources' }>)}
	{#if block.title}
		<h3 class="mb-4 text-2xl font-bold tracking-tight">{block.title}</h3>
		<Separator class="mb-6" />
	{/if}

	{#if block.urls.length > 0}
		<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each block.urls as url, i}
				<a
					href={url}
					class="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg active:translate-y-0"
					target="_blank"
					rel="noopener noreferrer"
					class:pointer-events-none={!url}
					class:opacity-50={!url}
				>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl text-primary transition-all group-hover:scale-110 group-hover:bg-primary/20"
					>
						📚
					</div>
					<span
						class="line-clamp-2 flex-1 font-medium text-gray-700 transition-colors group-hover:text-gray-900"
					>
						{block.urlLabels[i] || url}
					</span>
				</a>
			{/each}
		</div>
	{/if}

	<div class="markdown-content prose prose-slate max-w-none">
		{@html marked(block.content)}
	</div>
{/snippet}

{#snippet codeBlock(block: Extract<(typeof lesson.blocks)[0], { type: 'code' }>, index: number)}
	<Tabs.Root bind:value={activeTab} class="space-y-4">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<Tabs.List class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1">
				<Tabs.Trigger value="html" class="tab-trigger">HTML</Tabs.Trigger>
				<Tabs.Trigger value="css" class="tab-trigger">CSS</Tabs.Trigger>
				<Tabs.Trigger value="js" class="tab-trigger">JavaScript</Tabs.Trigger>
			</Tabs.List>
			<Button
				variant="outline"
				class="w-full transition-all hover:bg-primary hover:text-primary-foreground sm:w-auto"
				onclick={async () => {
					if (
						JSON.stringify($state.snapshot(lesson)) !==
						JSON.stringify($state.snapshot(lastRanLessonState))
					) {
						lastRanLessonState = structuredClone($state.snapshot(lesson));
					} else {
						lastRanLessonState = null;
						await new Promise((resolve) => setTimeout(resolve, 100));
						lastRanLessonState = structuredClone($state.snapshot(lesson));
					}
				}}
			>
				<PlayIcon class="mr-2 h-4 w-4" />
				Rulează codul
			</Button>
		</div>

		<div class="rounded-md">
			<Tabs.Content value="html">
				<Textarea bind:value={block.html} class="min-h-[200px] font-mono" />
			</Tabs.Content>
			<Tabs.Content value="css">
				<Textarea bind:value={block.css} class="min-h-[200px] font-mono" />
			</Tabs.Content>
			<Tabs.Content value="js">
				<Textarea bind:value={block.javascript} class="min-h-[200px] font-mono" />
			</Tabs.Content>
		</div>
		{#if lastRanLessonState !== null}
			<div class="mt-4 overflow-hidden rounded-lg border-2 bg-white">
				<div class="border-b bg-muted/50 px-4 py-2 text-sm font-medium">Output</div>
				<div class="h-[300px] w-full">
					<iframe
						title="Code Preview"
						class="h-full w-full"
						srcdoc={getCodePreview(
							lastRanLessonState!.blocks[index] as Extract<
								(typeof lesson.blocks)[0],
								{ type: 'code' }
							>
						)}
						sandbox="allow-scripts"
					></iframe>
				</div>
			</div>
		{/if}
	</Tabs.Root>
{/snippet}

<style>
	:global(.markdown-content h1) {
		@apply text-2xl font-bold;
	}
	:global(.markdown-content h2) {
		@apply text-xl font-bold;
	}

	:global(.markdown-content h3) {
		@apply text-lg font-bold;
	}

	:global(.markdown-content p) {
		@apply mb-4;
	}

	:global(.markdown-content ul) {
		@apply mb-4 list-inside list-disc;
	}

	:global(.markdown-content li) {
		@apply mb-2;
	}

	:global(.markdown-content hr) {
		@apply my-4;
	}

	:global(.markdown-content a) {
		@apply text-blue-500;
	}
	:global(.markdown-content iframe) {
		@apply w-full md:max-w-2xl;
	}
	:global(.tab-trigger) {
		@apply inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm;
	}
</style>
