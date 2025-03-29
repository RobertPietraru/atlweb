<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Card } from '$lib/components/ui/card';
	import { toast } from 'svelte-sonner';
	import { deserialize } from '$app/forms';
	import { marked } from 'marked';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { CodeIcon, PlusIcon, TextIcon, VideoIcon } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import { View } from 'svelte-lucide';

	let { data } = $props();
	let lesson = $state(data.lesson);
	let oldLesson = $state(data.lesson);
	let isSaved = $derived(
		JSON.stringify($state.snapshot(lesson)) == JSON.stringify($state.snapshot(oldLesson))
	);
	let visiblePopupIndex = $state<number | null>(null);
	$inspect(visiblePopupIndex);

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

	function insertBlock(type: 'text' | 'video' | 'code' | 'code_result', index: number) {
		/// remove all visible popups
		visiblePopupIndex = null;
		let block: (typeof lesson.blocks)[0];

		if (type === 'text') {
			block = {
				id: '',
				text: '',
				order: index,
				type: 'text'
			};
			lesson.blocks.splice(index, 0, block);
		} else if (type === 'video') {
			block = {
				id: '',
				urls: [],
				order: index,
				type: 'video'
			};
			lesson.blocks.splice(index, 0, block);
		} else if (type === 'code') {
			block = {
				id: '',
				html: '',
				css: '',
				javascript: '',
				order: index,
				type: 'code'
			};
			lesson.blocks.splice(index, 0, block);
		} else if (type === 'code_result') {
			block = {
				id: '',
				order: index,
				codeblockId: '',
				type: 'code_result'
			};
			lesson.blocks.splice(index, 0, block);
		}
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
				</div>

				{#if lesson.teaser}
					<div class="prose max-w-none">
						<h3 class="text-lg font-semibold">Teaser</h3>
						<div class="markdown-content mt-2">{@html marked(lesson.teaser)}</div>
					</div>
				{/if}

				{#if lesson.description}
					<div class="prose max-w-none">
						<h3 class="text-lg font-semibold">Descriere</h3>
						<div class="markdown-content mt-2">{@html marked(lesson.description)}</div>
					</div>
				{/if}
			</div>
		</Card>
	</div>
	{@render addBlock(-1)}
	{#each lesson.blocks as block, index}
		{#if block.type === 'text'}
			{@render textBlock(block)}
		{/if}
		{@render addBlock(index)}
	{/each}
</main>
{#snippet addBlock(index: number)}
	<div class="relative -mb-4 -mt-4" id="adder">
		<div class="group flex justify-center">
			<Button
				size="icon"
				class="z-10 h-8 w-8 rounded-full opacity-30 transition-all duration-300 group-hover:h-12 group-hover:w-12 group-hover:-translate-y-1 group-hover:opacity-100 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/30 {visiblePopupIndex === index
					? 'h-12 w-12 translate-y-1 opacity-100 bg-primary shadow-lg shadow-primary/30' 
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
					class="h-4 w-4 transition-all duration-300 group-hover:h-5 group-hover:w-5 group-hover:rotate-90 group-hover:scale-125 {visiblePopupIndex === index
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
						onclick={() => insertBlock('video', index)}
					>
						<VideoIcon class="h-5 w-5" />
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
						onclick={() => insertBlock('code_result', index)}
					>
						<View class="h-5 w-5" />
					</Button>
				</div>
			{/if}

			<Separator
				class="absolute top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent text-primary-foreground transition-all duration-300 ease-in-out group-hover:h-1 group-hover:via-primary/50"
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
</style>
