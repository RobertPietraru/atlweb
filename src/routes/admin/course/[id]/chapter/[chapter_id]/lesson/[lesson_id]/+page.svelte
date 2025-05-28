<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Toggle } from '$lib/components/ui/toggle';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Card } from '$lib/components/ui/card';
	import { toast } from 'svelte-sonner';
	import { deserialize } from '$app/forms';
	import { marked } from 'marked';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import {
		BookOpenIcon,
		CodeIcon,
		PlusIcon,
		TextIcon,
		PlayIcon,
		TrashIcon,
		Braces,
		BookOpen,
		Info,
		PlayCircle,
		FileCheck
	} from 'lucide-svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { slide } from 'svelte/transition';
	import { ArrowUp, ArrowDown } from 'lucide-svelte';

	let { data } = $props();
	let lesson = $state(data.lesson);
	let oldLesson = $state(data.lesson);

	let isSaved = $derived(
		JSON.stringify($state.snapshot(lesson)) == JSON.stringify($state.snapshot(oldLesson))
	);
	let visiblePopupIndex = $state<number | null>(null);
	/// the indexes of the blocks that are currently running code
	let currentlyRunningCode: number[] = $state([]);
	let activeTab = $state<'html' | 'css' | 'js'>('html');

	let saving = $state(false);

	async function saveLesson() {
		saving = true;
		try {
			const formdata = new FormData();
			formdata.append('lesson', JSON.stringify(lesson));

			const response = await fetch('?/updateLesson', {
				method: 'POST',
				body: formdata
			});

			const result = deserialize(await response.text());
			if (result.type === 'success') {
				toast.success('Lecția a fost salvată cu succes', {
					position: 'bottom-left'
				});
				console.log(result.data);
				lesson = result.data?.lesson as typeof lesson;
				oldLesson = structuredClone($state.snapshot(lesson));
			} else {
				toast.error('A apărut o eroare la salvarea lecției', {
					position: 'bottom-left'
				});
			}
		} catch (error) {
			console.error('Error saving lesson:', error);
			toast.error('A apărut o eroare la salvarea lecției', {
				position: 'bottom-left'
			});
		} finally {
			saving = false;
		}
	}

	function insertBlock(type: 'text' | 'resources' | 'code' | 'exercise', index: number) {
		/// stop all running code
		currentlyRunningCode = [];
		/// remove all visible popups
		visiblePopupIndex = null;
		let block: (typeof lesson.blocks)[0];

		if (type === 'text') {
			block = {
				text: '',
				type: 'text'
			};
			lesson.blocks.splice(index, 0, block);
		} else if (type === 'resources') {
			block = {
				title: '',
				content: '',
				urls: [],
				urlLabels: [],
				type: 'resources'
			};
			lesson.blocks.splice(index, 0, block);
		} else if (type === 'code') {
			block = {
				text: '',
				html: '',
				css: '',
				javascript: '',
				type: 'code'
			};
			lesson.blocks.splice(index, 0, block);
		} else if (type === 'exercise') {
			block = {
				type: 'exercise',
				exerciseId: ''
			};
			lesson.blocks.splice(index, 0, block);
		}
	}
	function getCodePreview(block: Extract<(typeof lesson.blocks)[0], { type: 'code' }>) {
		const css = block.css ?? '';
		const html = block.html ?? '';
		const javascript = block.javascript ?? '';

		let html_content = '';
		html_content += `<ht` + `ml>`;
		html_content += `<he` + `ad>`;
		html_content += `<sty` + `le>${css}</sty` + `le>`;
		html_content += `</he` + `ad>`;
		html_content += `<bo` + `dy>${html}</bo` + `dy>`;
		html_content += `<sc` + `ript>`;
		html_content += `(function() {
    var originalLog = console.log;
    console.log = function() {
      originalLog.apply(console, arguments);
      window.parent.postMessage({ type: 'log', data: [...arguments] }, '*');
    };
  })();
		`;
		html_content += `${javascript}</sc` + `ript>`;
		html_content += `</ht` + `ml>`;

		return html_content;
	}
</script>

<main class="p-8">
	<div class="mb-6 flex items-center justify-between">
		<div class="flex items-center gap-6">
			<Button variant="ghost" href="../" class="transition-colors hover:bg-gray-100/50">
				<span class="mr-2">←</span>
				<span>Înapoi la capitol</span>
			</Button>
			<h1 class="text-3xl font-bold tracking-tight">Editare lecție</h1>
		</div>
		<Button
			onclick={saveLesson}
			disabled={saving || isSaved}
			variant={isSaved ? 'outline' : 'default'}
		>
			{#if saving}
				<span class="inline-flex items-center">
					<span class="mr-2 animate-spin">⟳</span>
					Se salvează...
				</span>
			{:else if isSaved}
				<span>✓ Salvat</span>
			{:else}
				Salvează
			{/if}
		</Button>
	</div>

	<div class="grid grid-cols-2 gap-6">
		<!-- Left side - Edit form -->
		<Card class="p-4">
			<div class="space-y-4">
				<div class="space-y-2">
					<Label for="name">Titlu</Label>
					<Input id="name" bind:value={lesson.name} />
				</div>

				<div class="space-y-2">
					<Label for="teaser">Teaser</Label>
					<Textarea
						id="teaser"
						bind:value={lesson.teaser}
						placeholder="Scrie un scurt rezumat al lecției (markdown)"
						class="min-h-[100px]"
					/>
				</div>

				<div class="space-y-2">
					<Label for="description">Descriere</Label>
					<Textarea
						id="description"
						bind:value={lesson.description}
						placeholder="Scrie descrierea lecției (markdown)"
						class="min-h-[200px]"
					/>
				</div>
			</div>
		</Card>

		<!-- Right side - Preview -->
		<Card class="p-4">
			<div class="space-y-6">
				<div>
					<h2 class="text-2xl font-bold">{lesson.name || 'Titlul lecției'}</h2>
					<h3 class="markdown-content mt-2">{lesson.teaser}</h3>
				</div>

				<div class="markdown-content mt-2">{@html marked(lesson.description)}</div>
			</div>
		</Card>
	</div>
	{@render addBlock(0)}
	{#each lesson.blocks as block, index}
		<div class="flex">
			{@render manageBlock(index)}
			<div class="flex-1">
				{#if block.type === 'text'}
					{@render textBlock(block)}
				{/if}
				{#if block.type === 'resources'}
					{@render resourcesBlock(block)}
				{/if}
				{#if block.type === 'code'}
					{@render codeBlock(block, index)}
				{/if}

				{#if block.type === 'exercise'}
					{@const exercise = data.exercises.find((exercise) => exercise.id === block.exerciseId)}
					{#if exercise}
						{@render exerciseBlock(exercise)}
					{:else}
						<div class="flex h-full flex-col gap-4 p-4">
							<p class="text-lg text-muted-foreground">Exercițiul nu există</p>
						</div>
					{/if}
				{/if}
			</div>
		</div>
		{@render addBlock(index + 1)}
	{/each}
</main>
{#snippet addBlock(index: number)}
	<div class="relative -mb-4 -mt-4" id="adder">
		<div class="group flex justify-center">
			<Button
				size="icon"
				class="z-10 h-8 w-8 rounded-full opacity-30 transition-all duration-300 group-hover:h-12 group-hover:w-12 group-hover:-translate-y-1 group-hover:bg-primary group-hover:opacity-100 group-hover:shadow-lg group-hover:shadow-primary/30 {visiblePopupIndex ===
				index
					? 'h-12 w-12 translate-y-1 bg-primary opacity-100 shadow-lg shadow-primary/30'
					: ''}"
				onclick={() => {
					if (visiblePopupIndex === index) {
						visiblePopupIndex = null;
					} else {
						visiblePopupIndex = index;
					}
				}}
			>
				<PlusIcon
					class="h-4 w-4 transition-all duration-300 group-hover:h-5 group-hover:w-5 group-hover:rotate-90 group-hover:scale-125 {visiblePopupIndex ===
					index
						? 'h-5 w-5 rotate-90 scale-125'
						: ''}"
				/>
			</Button>

			{#if visiblePopupIndex === index}
				<div
					class="absolute bottom-full z-50 mb-2 flex items-center gap-2 rounded-lg bg-background p-2 shadow-lg"
					transition:slide={{ duration: 200 }}
				>
					<Button
						variant="ghost"
						size="icon"
						class="rounded-full hover:bg-primary/20"
						onclick={() => insertBlock('text', index)}
					>
						<TextIcon class="h-5 w-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						class="rounded-full hover:bg-primary/20"
						onclick={() => insertBlock('resources', index)}
					>
						<BookOpenIcon class="h-5 w-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						class="rounded-full hover:bg-primary/20"
						onclick={() => insertBlock('code', index)}
					>
						<CodeIcon class="h-5 w-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						class="rounded-full hover:bg-primary/20"
						onclick={() => insertBlock('exercise', index)}
					>
						<Braces class="h-5 w-5" />
					</Button>
				</div>
			{/if}

			<Separator
				class="absolute top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent text-primary-foreground transition-all duration-300 ease-in-out group-hover:h-1 group-hover:via-primary/50"
			/>
		</div>
	</div>
{/snippet}

{#snippet manageBlock(index: number)}
	<div class="relative -ml-4 -mr-2" id="adder">
		<div class="group flex flex-col">
			<div class="flex flex-col justify-between gap-2">
				<Button
					variant="destructive"
					size="icon"
					class="z-10 h-8 w-8 rounded-full opacity-30 transition-all duration-300 group-hover:h-12 group-hover:w-12 group-hover:-translate-y-1 group-hover:opacity-100 group-hover:shadow-lg group-hover:shadow-primary/30"
					onclick={() => {
						lesson.blocks.splice(index, 1);
					}}
				>
					<TrashIcon
						class="h-4 w-4 -rotate-90 transition-all duration-300 group-hover:h-5 group-hover:w-5 group-hover:rotate-0 group-hover:scale-125"
					/>
				</Button>
				{#if index !== 0}
					<Button
						size="icon"
						class="z-10 h-8 w-8 rounded-full opacity-30 transition-all duration-300 group-hover:h-12 group-hover:w-12 group-hover:-translate-y-1 group-hover:opacity-100 group-hover:shadow-lg group-hover:shadow-primary/30"
						disabled={index === 0}
						onclick={() => {
							const temp = lesson.blocks[index];
							lesson.blocks[index] = lesson.blocks[index - 1];
							lesson.blocks[index - 1] = temp;
						}}
					>
						<ArrowUp
							class="h-4 w-4  transition-all duration-300 group-hover:h-5 group-hover:w-5 group-hover:scale-125"
						/>
					</Button>
				{/if}

				{#if index !== lesson.blocks.length - 1}
					<Button
						size="icon"
						class="z-10 h-8 w-8 rounded-full opacity-30 transition-all duration-300 group-hover:h-12 group-hover:w-12 group-hover:-translate-y-1 group-hover:opacity-100 group-hover:shadow-lg group-hover:shadow-primary/30"
						disabled={index === lesson.blocks.length - 1}
						onclick={() => {
							const temp = lesson.blocks[index];
							lesson.blocks[index] = lesson.blocks[index + 1];
							lesson.blocks[index + 1] = temp;
						}}
					>
						<ArrowDown
							class="h-4 w-4  transition-all duration-300 group-hover:h-5 group-hover:w-5 group-hover:scale-125"
						/>
					</Button>
				{/if}
			</div>

			<Separator
				class="absolute left-1/2 h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/20 to-transparent text-primary-foreground transition-all duration-300 ease-in-out group-hover:w-1 group-hover:via-primary/50"
			/>
		</div>
	</div>
{/snippet}

{#snippet textBlock(block: Extract<(typeof lesson.blocks)[0], { type: 'text' }>)}
	<div class="flex flex-col gap-2">
		<div class="grid grid-cols-2 gap-4">
			<div class="flex flex-col gap-2">
				<Textarea
					class="h-full min-h-[200px]"
					placeholder="Write your content here..."
					bind:value={block.text}
				/>
			</div>
			<div class="markdown-content h-full min-h-[200px] overflow-y-auto p-4">
				{@html marked(block.text)}
			</div>
		</div>
	</div>
{/snippet}

{#snippet resourcesBlock(block: Extract<(typeof lesson.blocks)[0], { type: 'resources' }>)}
	<div class="flex flex-col gap-4">
		<div class="grid grid-cols-2 gap-4">
			<div class="flex h-full flex-col gap-4">
				<Input placeholder="Enter title..." bind:value={block.title} />

				<div class="flex flex-col gap-2">
					{#each block.urls as _, i}
						<div class="flex gap-2">
							<Input placeholder="URL..." bind:value={block.urls[i]} />
							<Input placeholder="Label..." bind:value={block.urlLabels[i]} />
							<Button
								variant="ghost"
								size="icon"
								class="shrink-0"
								onclick={() => {
									block.urls.splice(i, 1);
									block.urlLabels.splice(i, 1);
									block.urls = block.urls;
									block.urlLabels = block.urlLabels;
								}}
							>
								×
							</Button>
						</div>
					{/each}
					<Button
						variant="outline"
						onclick={() => {
							block.urls = [...block.urls, ''];
							block.urlLabels = [...block.urlLabels, ''];
						}}
					>
						Add URL
					</Button>
				</div>

				<Textarea
					class="min-h-[200px] flex-1"
					placeholder="Write your content here..."
					bind:value={block.content}
				/>
			</div>

			<div class="flex h-full flex-col gap-4 p-4">
				{#if block.title}
					<h3 class="text-xl font-bold">{block.title}</h3>
					<Separator />
				{/if}

				{#if block.urls.length > 0}
					<div class="grid grid-cols-2 gap-4">
						{#each block.urls as url, i}
							<a
								href={url}
								class="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm shadow-gray-200 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-primary/20 hover:bg-gray-50 hover:shadow-lg active:translate-y-0 active:shadow-md"
								target="_blank"
								rel="noopener noreferrer"
								class:pointer-events-none={!url}
								class:opacity-50={!url}
							>
								<div
									class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg text-primary transition-colors group-hover:scale-105 group-hover:bg-primary/20"
								>
									📚
								</div>
								<span
									class="line-clamp-1 flex-1 font-medium text-gray-700 transition-colors group-hover:text-gray-900"
								>
									{block.urlLabels[i] || url}
								</span>
							</a>
						{/each}
					</div>
				{/if}

				<div class="markdown-content flex-1">
					{@html marked(block.content)}
				</div>
			</div>
		</div>
	</div>
{/snippet}

{#snippet codeBlock(block: Extract<(typeof lesson.blocks)[0], { type: 'code' }>, index: number)}
	<div class="flex flex-col gap-4">
		<div class="grid grid-cols-2 gap-4">
			<div class="flex h-full flex-col gap-4">
				<Textarea bind:value={block.text} placeholder="Scrie textul pentru acest bloc" />
				<Tabs.Root bind:value={activeTab}>
					<div class="flex items-center justify-between">
						<Tabs.List>
							<Tabs.Trigger value="html">HTML</Tabs.Trigger>
							<Tabs.Trigger value="css">CSS</Tabs.Trigger>
							<Tabs.Trigger value="js">JavaScript</Tabs.Trigger>
						</Tabs.List>
					</div>
					<Tabs.Content value="html">
						<Textarea bind:value={block.html} />
					</Tabs.Content>
					<Tabs.Content value="css">
						<Textarea bind:value={block.css} />
					</Tabs.Content>
					<Tabs.Content value="js">
						<Textarea bind:value={block.javascript} />
					</Tabs.Content>
				</Tabs.Root>
			</div>

			<div class="flex h-full flex-col gap-4 p-4">
				<div class="markdown-content">
					{@html marked(block.text)}
				</div>
				<Tabs.Root bind:value={activeTab}>
					<div class="flex items-center justify-between">
						<Tabs.List>
							<Tabs.Trigger value="html">HTML</Tabs.Trigger>
							<Tabs.Trigger value="css">CSS</Tabs.Trigger>
							<Tabs.Trigger value="js">JavaScript</Tabs.Trigger>
						</Tabs.List>
					</div>
					<Tabs.Content value="html">
						<Textarea bind:value={block.html} disabled />
					</Tabs.Content>
					<Tabs.Content value="css">
						<Textarea bind:value={block.css} disabled />
					</Tabs.Content>
					<Tabs.Content value="js">
						<Textarea bind:value={block.javascript} disabled />
					</Tabs.Content>
				</Tabs.Root>
				<Button
					variant="outline"
					onclick={() => {
						currentlyRunningCode.push(index);
					}}
				>
					<PlayIcon class="mr-2 h-4 w-4" />
					Run
				</Button>

				{#if currentlyRunningCode.includes(index)}
					<div class="flex h-full flex-col gap-4 p-4">
						<iframe title="Code Preview" class="h-full w-full" srcdoc={getCodePreview(block)}
						></iframe>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/snippet}

{#snippet exerciseBlock(exercise: typeof data.exercises[0])}
	<div class="flex flex-col gap-4">
		<div class="grid grid-cols-2 gap-4">
			<div class="flex h-full flex-col gap-4">
				<div class="flex items-center justify-center p-8">
					<p class="text-lg text-muted-foreground">🚧 Această secțiune este în lucru</p>
				</div>
			</div>

			<div class="flex h-full flex-col gap-4 p-4">
				<Card class="space-y-4">
					<div class="flex items-center gap-2 px-4 pt-4">
						<BookOpen class="h-5 w-5 text-primary" />
						<h3 class="text-lg font-semibold">Exercițiu: {exercise.name}</h3>
					</div>
					<Separator />
					<div class="flex items-start gap-2 px-4">
						<p class="text-sm text-muted-foreground">{exercise.description}</p>
					</div>
					<div class="flex items-center justify-end gap-2 px-4 pb-4">
						<div class="flex items-center gap-1.5">
							<FileCheck class="h-4 w-4 text-muted-foreground" />
							<span class="text-sm font-medium text-muted-foreground">
								Nu ai rezolvat acest exercițiu
							</span>
						</div>
						<div class="flex-1"></div>
						<Button variant="outline" size="sm" class="gap-2">
							<PlayCircle class="h-4 w-4" />
							<span>Încearcă exercițiul</span>
						</Button>
					</div>
				</Card>
			</div>
		</div>
	</div>
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
	:global(.markdown-content a) {
		@apply text-blue-500;
	}

	:global(.markdown-content code) {
		@apply bg-muted p-1 text-muted-foreground;
	}
	:global(.markdown-content pre) {
		@apply bg-muted p-1 text-muted-foreground;
	}

	:global(.markdown-content hr) {
		@apply my-4;
	}
</style>
