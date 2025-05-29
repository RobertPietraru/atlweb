<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { toast } from 'svelte-sonner';
	import { deserialize } from '$app/forms';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';

	let { data } = $props();
	let lessons = $state(data.chapter.lessons.map((l) => ({ ...l })));
	let initialLessons = data.chapter.lessons;
	let hasChanges = $derived(JSON.stringify(lessons) !== JSON.stringify(initialLessons));

	let loading = $state(false);
	let isEditing = $state(false);
	let editForm = $state({
		name: data.chapter.name,
		description: data.chapter.description
	});

	function calculateNewOrder(index: number, direction: 'up' | 'down'): number {
		if (direction === 'up' && index > 0) {
			const temp = lessons[index];
			lessons[index] = lessons[index - 1];
			lessons[index - 1] = temp;
		} else if (direction === 'down' && index < lessons.length - 1) {
			const temp = lessons[index];
			lessons[index] = lessons[index + 1];
			lessons[index + 1] = temp;
		}
		// Recalculate all orders to be sequential
		lessons = lessons.map((l, idx) => ({ ...l, order: idx + 1 }));
		return lessons[index].order;
	}

	async function saveLessonOrder() {
		loading = true;
		try {
			const response = await fetch('?/manageLessons', {
				method: 'POST',
				body: JSON.stringify({
					lessons: lessons.map((l) => l.id)
				})
			});

			const result = deserialize(await response.text());
			if (result.type === 'success') {
				initialLessons = [...lessons];
				hasChanges = false;
			} else if (result.type === 'failure') {
				console.error('Error saving lesson order:', result.data?.message);
				toast.error(
					(result.data?.message as string | undefined | null) ??
						'A apărut o eroare la salvarea ordinii lecțiilor',
					{
						position: 'bottom-left'
					}
				);
			}
		} catch (error) {
			console.error('Error saving lesson order:', error);
			toast.error('A apărut o eroare la salvarea ordinii lecțiilor', {
				position: 'bottom-left'
			});
		} finally {
			loading = false;
		}
	}

	async function saveChapterInfo() {
		loading = true;
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
				data.chapter.name = editForm.name;
				data.chapter.description = editForm.description;
				isEditing = false;
				toast.success('Informațiile au fost actualizate cu succes', {
					position: 'bottom-left'
				});
			} else if (result.type === 'failure') {
				toast.error(
					(result.data?.message as string | undefined | null) ?? 
						'A apărut o eroare la actualizarea informațiilor',
					{
						position: 'bottom-left'
					}
				);
			}
		} catch (error) {
			console.error('Error updating chapter:', error);
			toast.error('A apărut o eroare la actualizarea informațiilor', {
				position: 'bottom-left'
			});
		} finally {
			loading = false;
		}
	}

	function deleteLesson(index: number) {
		lessons = lessons.filter((_, i) => i !== index);
		hasChanges = true;
	}
</script>

<div class="container mx-auto max-w-4xl py-12" class:pointer-events-none={loading}>
	<header class="mb-12">
		<h1 class="text-4xl font-bold tracking-tight">Capitol: {data.chapter.name}</h1>
	</header>

	<div class="grid gap-12">
		<section>
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-2xl font-semibold tracking-tight">Informații de bază</h2>
				{#if !isEditing}
					<Button variant="outline" onclick={() => (isEditing = true)}>Editează</Button>
				{/if}
			</div>
			<Card>
				<CardContent class="space-y-6 pt-6">
					{#if isEditing}
						<div>
							<Label for="name">Nume capitol</Label>
							<Input id="name" bind:value={editForm.name} />
						</div>
						<div>
							<Label for="description">Descriere</Label>
							<Textarea id="description" bind:value={editForm.description} />
						</div>
						<div class="flex gap-2">
							<Button variant="default" onclick={saveChapterInfo} disabled={loading}>Salvează</Button>
							<Button variant="outline" onclick={() => (isEditing = false)} disabled={loading}>
								Anulează
							</Button>
						</div>
					{:else}
						<div>
							<Label class="text-sm text-muted-foreground">Nume capitol</Label>
							<p class="mt-1 text-lg font-medium">{data.chapter.name}</p>
						</div>
						<div>
							<Label class="text-sm text-muted-foreground">Descriere</Label>
							<p class="mt-1 text-lg leading-relaxed">{data.chapter.description}</p>
						</div>
					{/if}
				</CardContent>
			</Card>
		</section>

		<section>
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-2xl font-semibold tracking-tight">Lecții</h2>
				<div class="flex gap-2">
					<form action="?/create" method="post">
						<Button type="submit">Adaugă lecție nouă</Button>
					</form>
				</div>
			</div>

			{#if hasChanges}
				<Button variant="default" onclick={saveLessonOrder} disabled={loading} class="w-full">
					Salvează
				</Button>
			{/if}

			{#if lessons.length === 0}
				<Card>
					<CardContent class="pt-6">
						<p class="text-center text-muted-foreground">Nu există lecții pentru acest capitol.</p>
					</CardContent>
				</Card>
			{:else}
				<div class="space-y-4">
					{#each lessons as lesson, index}
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
										{#if index < lessons.length - 1}
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
									<h3 class="text-lg font-medium">{lesson.name}</h3>
								</div>
								<div class="flex gap-2">
									<Button
										variant="outline"
										href="/admin/course/{data.courseId}/chapter/{data.chapter
											.id}/lesson/{lesson.id}"
									>
										Editează
									</Button>
									<Button variant="destructive" onclick={() => deleteLesson(index)}>Șterge</Button>
								</div>
							</CardContent>
						</Card>
					{/each}
				</div>
			{/if}
		</section>
	</div>
</div>
