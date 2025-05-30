<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent } from '$lib/components/ui/card';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { deserialize } from '$app/forms';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	let { data } = $props();
	let chapters = $state(data.course.chapters.map((ch) => ({ ...ch })));
	let initialChapters = data.course.chapters;
	let hasChanges = $derived(JSON.stringify(chapters) !== JSON.stringify(initialChapters));
	let saving = $state(false);
	let isEditing = $state(false);
	let editForm = $state({
		name: data.course.name,
		description: data.course.description
	});

	let loading = $state(false);

	function calculateNewOrder(index: number, direction: 'up' | 'down'): number {
		if (direction === 'up' && index > 0) {
			const temp = chapters[index];
			chapters[index] = chapters[index - 1];
			chapters[index - 1] = temp;
		} else if (direction === 'down' && index < chapters.length - 1) {
			const temp = chapters[index];
			chapters[index] = chapters[index + 1];
			chapters[index + 1] = temp;
		}
		// Recalculate all orders to be sequential
		chapters = chapters.map((ch, idx) => ({ ...ch, order: idx + 1 }));
		return chapters[index].order;
	}

	async function saveChapterOrder() {
		loading = true;
		try {
			const response = await fetch('?/manageChapters', {
				method: 'POST',
				body: JSON.stringify({
					chapters: chapters.map(ch => ch.id)
				})
			});

			const result = deserialize(await response.text());
			if (result.type === 'success') {
				initialChapters = [...chapters];
				hasChanges = false;
			} else if (result.type === 'failure') {
				console.error('Error saving chapter order:', result.data?.message);
				toast.error(
					(result.data?.message as string | undefined | null) ?? 
					'A apărut o eroare la salvarea ordinii capitolelor',
					{
						position: 'bottom-left'
					}
				);
			}
		} catch (error) {
			console.error('Error saving chapter order:', error);
			toast.error('A apărut o eroare la salvarea ordinii capitolelor', {
				position: 'bottom-left'
			});
		} finally {
			loading = false;
		}
	}

	async function saveCourseInfo() {
		saving = true;
		try {
			const formData = new FormData();
			formData.append('name', editForm.name);
			formData.append('description', editForm.description);
			const response = await fetch('?/update', {
				method: 'POST',
				body: formData
			});

			const result = deserialize(await response.text());
			if (result.type === 'success') {
				data.course.name = editForm.name;
				data.course.description = editForm.description;
				isEditing = false;
				toast.success('Informațiile cursului au fost salvate cu succes', {
					position: 'bottom-left'
				});
			} else if (result.type === 'failure') {
				console.error('Error saving course info:', result.data?.message);
				toast.error(
					(result.data?.message as string | undefined | null) ?? 
					'A apărut o eroare la salvarea informațiilor cursului',
					{
						position: 'bottom-left'
					}
				);
			}
		} catch (error) {
			console.error('Error saving course info:', error);
			toast.error('A apărut o eroare la salvarea informațiilor cursului', {
				position: 'bottom-left'
			});
		} finally {
			saving = false;
		}
	}

	function deleteChapter(index: number) {
		chapters = chapters.filter((_, i) => i !== index);
		hasChanges = true;
	}
</script>

<div class="container mx-auto max-w-4xl py-12">
	<header class="mb-12">
		<h1 class="text-4xl font-bold tracking-tight">Curs: {data.course.name}</h1>
	</header>

	<div class="grid gap-12">
		<section>
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-2xl font-semibold tracking-tight">Informații de bază</h2>
				{#if !isEditing}
					<Button variant="outline" onclick={() => (isEditing = true)} id="edit-course-button">Editează</Button>
				{/if}
			</div>
			<Card>
				<CardContent class="space-y-6 pt-6">
					{#if isEditing}
						<div>
							<Label for="name">Nume curs</Label>
							<Input id="name" bind:value={editForm.name} />
						</div>
						<div>
							<Label for="description">Descriere</Label>
							<Textarea id="description" bind:value={editForm.description} />
						</div>
						<div class="flex gap-2">
							<Button variant="default" onclick={saveCourseInfo} disabled={saving}>Salvează</Button>
							<Button variant="outline" onclick={() => (isEditing = false)} disabled={saving}>
								Anulează
							</Button>
						</div>
					{:else}
						<div>
							<Label class="text-sm text-muted-foreground">Nume curs</Label>
							<p class="mt-1 text-lg font-medium">{data.course.name}</p>
						</div>
						<div>
							<Label class="text-sm text-muted-foreground">Descriere</Label>
							<p class="mt-1 text-lg leading-relaxed">{data.course.description}</p>
						</div>
					{/if}
				</CardContent>
			</Card>
		</section>

		<section>
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-2xl font-semibold tracking-tight">Capitole</h2>
				<div class="flex gap-2">
					<form action="?/createChapter" method="POST">
						<Button id="add-chapter-button" type="submit">Adaugă capitol nou</Button>
					</form>
				</div>
			</div>

			{#if hasChanges}
				<Button variant="default" onclick={saveChapterOrder} disabled={loading} class="w-full">
					Salvează
				</Button>
			{/if}

			{#if chapters.length === 0}
				<Card>
					<CardContent class="pt-6">
						<p class="text-center text-muted-foreground">Nu există capitole pentru acest curs.</p>
					</CardContent>
				</Card>
			{:else}
				<div class="space-y-4">
					{#each chapters as chapter, index}
						<Card>
							<CardContent class="flex items-center justify-between p-4">
								<div class="flex items-center gap-4">
									<div class="flex flex-col gap-1">
										{#if index > 0}
											<Button
												variant="ghost"
												size="icon"
												class="h-6 w-6"
												onclick={() => calculateNewOrder(index, 'up')}
											>
												↑
											</Button>
										{/if}
										{#if index < chapters.length - 1}
											<Button
												variant="ghost"
												size="icon"
												class="h-6 w-6"
												onclick={() => calculateNewOrder(index, 'down')}
											>
												↓
											</Button>
										{/if}
									</div>
									<h3 class="text-lg font-medium">{chapter.name}</h3>
								</div>
								<div class="flex gap-2">
									<Button
										variant="outline"
										href="/admin/courses/{data.course.id}/chapters/{chapter.id}"
									>
										Editează
									</Button>
									<Button 
										variant="destructive"
										onclick={() => deleteChapter(index)}
									>
										Șterge
									</Button>
								</div>
							</CardContent>
						</Card>
					{/each}
				</div>
			{/if}
		</section>
	</div>
</div>

