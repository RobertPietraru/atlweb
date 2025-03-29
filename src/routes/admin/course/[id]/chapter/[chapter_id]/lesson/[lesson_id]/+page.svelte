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

<div class="p-8">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Editare lecție</h1>
		<Button onclick={saveLesson} disabled={saving || isSaved}>
			{saving ? 'Se salvează...' : isSaved ? 'Salvat' : 'Salvează'}
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
</div>

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
