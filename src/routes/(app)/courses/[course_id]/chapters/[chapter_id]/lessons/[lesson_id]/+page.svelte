<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { marked } from 'marked';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { page } from '$app/state';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { LogOut, LogIn, UserRound, Settings, X } from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Sun, Moon } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	import { PlayIcon, BookOpenIcon, MenuIcon, BookOpen, FileCheck, PlayCircle } from 'lucide-svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { onMount } from 'svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import { Card } from '$lib/components/ui/card/index.js';
	import * as m from '$lib/paraglide/messages.js';
	const isMobile = new IsMobile();

	async function logout() {
		const res = await fetch('/api/auth/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		/// reload page
		if (res.ok) {
			location.reload();
		} else {
			console.error('Failed to logout');
		}
	}
	let { data } = $props();
	$effect(() => {
		lesson = data.lesson;
	});
	let lesson = $state(data.lesson);
	let stateOfLastRanBlocks: ((typeof lesson.blocks)[0] | null)[] = $state(
		data.lesson.blocks.map(() => null)
	);
	let showSidebar = $state(true);
	$inspect(showSidebar);

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
	let isDarkTheme = $state(false);
	onMount(() => {
		isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
	});
	$effect(() => {
		const htmlEl = document.documentElement;
		if (isDarkTheme) {
			localStorage.setItem('isDarkTheme', 'true');
			htmlEl.classList.add('dark');
		} else {
			localStorage.setItem('isDarkTheme', 'false');
			htmlEl.classList.remove('dark');
		}
	});
</script>

<div class="flex min-h-screen w-full {isMobile.current ? 'flex-col-reverse' : 'flex-row'}">
	<!-- w-full border-b bg-card lg:fixed lg:right-0 lg:h-screen lg:w-96 lg:border-b-0 lg:border-l -->

	<main class="flex-1">
		<div class="px-4 pt-4 md:px-8">
			<Breadcrumb.Root class="flex items-center pb-4">
				<Breadcrumb.List>
					<Breadcrumb.Separator />
					{#each data.breadcrumbs as crumb, i}
						<Breadcrumb.Item>
							<Breadcrumb.Link href={crumb.url}>
								{crumb.name}
							</Breadcrumb.Link>
						</Breadcrumb.Item>
						{#if i < data.breadcrumbs.length - 1}
							<Breadcrumb.Separator />
						{/if}
					{/each}
				</Breadcrumb.List>
			</Breadcrumb.Root>
			<div class="mb-4 flex gap-4">
				<div class="flex items-center gap-3">
					<div class="rounded-full bg-primary/10 p-2">
						<BookOpenIcon class="h-5 w-5 text-primary" />
					</div>
					<h1 class="text-2xl font-bold">{lesson.name || 'Lectie'}</h1>
				</div>
			</div>

			<div class="space-y-8">
				{#each lesson.blocks as block, index}
					{#if block.type === 'exercise'}
						<!-- for some reason, without this div, the exercise block will stick to the one above, idk why -->
						{@const exercise = data.exercises.find((e) => e.id === block.exerciseId)}
						{#if exercise}
							{@render exerciseBlock(exercise)}
						{:else}
							<div
								class="rounded-lg border-2 bg-muted/50 p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md md:p-6"
							>
								<p class="text-muted-foreground">{m.exercise_was_not_found()}</p>
							</div>
						{/if}
					{:else}
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
					{/if}
				{/each}
			</div>
		</div>
	</main>
	<aside class="border-b bg-card md:max-w-96">
		<div class="flex flex-col">
			<div class="rounded-xl bg-muted/50 p-6 shadow-sm">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="mb-2 text-xl font-semibold">
							{m.chapter_lessons_in_this_chapter()}
						</h3>
						<p class="mb-6 text-sm text-muted-foreground">
							{m.chapter_lessons_in_this_chapter_description()}
						</p>
					</div>
					<Button variant="ghost" onclick={() => (showSidebar = !showSidebar)} class="md:hidden">
						<MenuIcon class="h-4 w-4" />
					</Button>
				</div>

				<div class="space-y-3 {showSidebar ? '' : 'hidden'} md:block">
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
			<Separator class="{showSidebar ? '' : 'hidden'} md:block" />
			<div class="rounded-xl bg-muted/50 p-6 shadow-sm {showSidebar ? '' : 'hidden'} md:block">
				<h3 class="mb-2 text-xl font-semibold">Progres</h3>
				<p class="text-sm text-muted-foreground">
					{m.chapter_lesson_count({
						nr1: data.lessonNamesInChapter.findIndex((l) => l.id === data.lesson.id) + 1,
						nr2: data.lessonNamesInChapter.length
					})}
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
		{#if block.text}
			<div class="markdown-content prose prose-slate max-w-none">
				{@html marked(block.text)}
			</div>
		{/if}
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
						JSON.stringify($state.snapshot(lesson.blocks[index])) !==
						JSON.stringify($state.snapshot(stateOfLastRanBlocks[index]))
					) {
						for (let i = 0; i < lesson.blocks.length; i++) {
							stateOfLastRanBlocks[i] = null;
						}
						stateOfLastRanBlocks[index] = structuredClone($state.snapshot(lesson.blocks[index]));
					} else {
						for (let i = 0; i < lesson.blocks.length; i++) {
							stateOfLastRanBlocks[i] = null;
						}
						await new Promise((resolve) => setTimeout(resolve, 100));
						stateOfLastRanBlocks[index] = structuredClone($state.snapshot(lesson.blocks[index]));
					}
				}}
			>
				<PlayIcon class="mr-2 h-4 w-4" />
				{m.code_block_run()}
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
		{#if stateOfLastRanBlocks[index]}
			<div class="mt-4 overflow-hidden rounded-lg border-2 bg-white">
				<div class="border-b bg-muted/50 px-4 py-2 text-sm font-medium">Output</div>
				<div class="h-[300px] w-full">
					<iframe
						title="Code Preview"
						class="h-full w-full"
						srcdoc={getCodePreview(
							stateOfLastRanBlocks[index] as Extract<(typeof lesson.blocks)[0], { type: 'code' }>
						)}
						sandbox="allow-scripts"
					></iframe>
				</div>
			</div>
		{/if}
	</Tabs.Root>
{/snippet}

{#snippet exerciseBlock(exercise: (typeof data.exercises)[0])}
	<a href="/exercises/{exercise.id}" class="block transition-all duration-200 hover:scale-[1.02]">
		<Card
			class="space-y-4 transition-colors duration-200 hover:bg-muted/50 {exercise.hasSubmission
				? 'bg-primary/10'
				: ''}"
		>
			<div class="flex items-center gap-2 px-4 pt-4">
				<BookOpen
					class="h-5 w-5 text-primary transition-transform duration-200 group-hover:scale-110"
				/>
				<h3 class="text-lg font-semibold">{m.exercise_title({title: exercise.title})}</h3>
			</div>
			<Separator />
			<div class="flex items-start gap-2 px-4">
				<p class="text-sm text-muted-foreground">{exercise.summary}</p>
			</div>
			<div class="flex items-center justify-end gap-2 px-4 pb-4">
				<div class="flex items-center gap-1.5">
					{#if exercise.hasSubmission}
						<FileCheck class="h-4 w-4 text-primary" />
						<span class="animate-pulse text-sm font-medium text-primary"> {m.exercise_submission_submitted()} </span>
					{:else}
						<FileCheck class="h-4 w-4 text-muted-foreground" />
						<span class="text-sm font-medium text-muted-foreground"> {m.exercise_submission_not_submitted()} </span>
					{/if}
				</div>
				<div class="flex-1"></div>
				<Button
					variant="outline"
					size="sm"
					class="gap-2 transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
				>
					<PlayCircle class="h-4 w-4" />
					<span>{m.exercise_try()}</span>
				</Button>
			</div>
		</Card>
	</a>
{/snippet}

<svelte:head>
	<title>{lesson.name} | atlweb.vercel.app</title>
	<meta name="description" content={lesson.teaser} />
	<meta property="og_site_name" content="“atlweb.vercel.app”" />
	<meta property="og:url" content="https://atlweb.vercel.app{page.url.pathname.toString()}" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={lesson.name} />
	<meta property="og:description" content={lesson.teaser} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="“atlweb.vercel.app" />
	<meta property="twitter:url" content="https://atlweb.vercel.app{page.url.pathname.toString()}" />
	<meta name="twitter:title" content={lesson.name} />
	<meta name="twitter:description" content={lesson.teaser} />
	{@html `  <script type="application/ld+json">{
   "@context": "https://schema.org",
   "@type": "Website",
   "name": "${lesson.name} | atlweb.vercel.app",
   "url": "https//www.atlweb.vercel.app${page.url.pathname}",
   }</script>`}
</svelte:head>

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
	:global(.markdown-content code) {
		@apply bg-muted p-1 text-muted-foreground;
	}

	:global(.markdown-content pre) {
		@apply bg-muted p-1 text-muted-foreground;
	}
	:global(.tab-trigger) {
		@apply inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm;
	}
</style>
