<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Card } from '$lib/components/ui/card';
	import { toast } from 'svelte-sonner';
	import { deserialize } from '$app/forms';
	import { superForm } from 'sveltekit-superforms';
	import { marked } from 'marked';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { PlusIcon } from 'lucide-svelte';

	let { data } = $props();
	let lesson = $state(data.lesson);
	let oldLesson = $state(data.lesson);
	let isSaved = $derived(
		JSON.stringify($state.snapshot(lesson)) == JSON.stringify($state.snapshot(oldLesson))
	);

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

	<div class="relative -my-3" id="adder">
		<div class="flex justify-center group">
			<Button 
				size="icon" 
				class="z-10 h-10 rounded-full hover:bg-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1"
			>
				<PlusIcon 
					class="h-4 w-4 transition-all duration-300 group-hover:rotate-90 group-hover:scale-125" 
				/>
			</Button>
			<Separator 
				class="h-[2px] absolute top-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent text-primary-foreground group-hover:via-primary/50 group-hover:h-1 transition-all duration-300 ease-in-out"
			/>
		</div>
	</div>
</main>

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
