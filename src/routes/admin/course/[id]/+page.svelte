<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import * as Dialog from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';
	import { deserialize } from '$app/forms';

	let { data } = $props();
	let chapters = $state(data.course.chapters.map((ch) => ({ ...ch })));
	let initialChapters = data.course.chapters;
	let hasChanges = $derived(JSON.stringify(chapters) !== JSON.stringify(initialChapters));

	const { form, message, errors } = superForm(data.form);
	let dialogOpen = $state(false);
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

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		
		try {
			loading = true;
			const formData = new FormData(event.target as HTMLFormElement);
			const response = await fetch('?/create', {
				method: 'POST',
				body: formData
			});

			const result = deserialize(await response.text());
			if (result.type === 'success') {
				dialogOpen = false;
				hasChanges = false;
			} else if (result.type === 'failure') {
				console.error('Error creating chapter:', result.data?.message);
				toast.error(
					(result.data?.message as string | undefined | null) ?? 
					'A apărut o eroare la crearea capitolului',
					{
						position: 'bottom-left' 
					}
				);
			}
		} catch (error) {
			console.error('Error creating chapter:', error);
			toast.error('A apărut o eroare la crearea capitolului');
		} finally {
			loading = false;
		}
	}

	async function saveChapterOrder() {
		loading = true;
		try {
			const response = await fetch('?/reorderAll', {
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
</script>

<div class="container mx-auto max-w-4xl py-12">
	<header class="mb-12">
		<h1 class="text-4xl font-bold tracking-tight">Curs: {data.course.name}</h1>
	</header>

	<div class="grid gap-12">
		<section>
			<h2 class="mb-6 text-2xl font-semibold tracking-tight">Informații de bază</h2>
			<Card>
				<CardContent class="space-y-6 pt-6">
					<div>
						<Label class="text-sm text-muted-foreground">Nume curs</Label>
						<p class="mt-1 text-lg font-medium">{data.course.name}</p>
					</div>
					<div>
						<Label class="text-sm text-muted-foreground">Descriere</Label>
						<p class="mt-1 text-lg leading-relaxed">{data.course.description}</p>
					</div>
				</CardContent>
			</Card>
		</section>

		<section>
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-2xl font-semibold tracking-tight">Capitole</h2>
				<div class="flex gap-2">
					<Button onclick={() => (dialogOpen = true)}>Adaugă capitol nou</Button>
				</div>
			</div>

			{#if hasChanges}
				<Button variant="default" onclick={saveChapterOrder} disabled={loading} class="w-full">
					Salvează ordinea
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
								<Button
									variant="outline"
									href="/admin/course/{data.course.id}/chapters/{chapter.id}"
								>
									Editează
								</Button>
							</CardContent>
						</Card>
					{/each}
				</div>
			{/if}
		</section>
	</div>
</div>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Adaugă capitol nou</Dialog.Title>
		</Dialog.Header>
		<form method="POST" class="space-y-4" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="name">Nume capitol</Label>
				<Input
					id="name"
					name="name"
					type="text"
					aria-invalid={$errors.name ? 'true' : 'false'}
					required
					bind:value={$form.name}
				/>
				<p class="text-destructive">{$errors.name}</p>
			</div>
			<div class="space-y-2">
				<Label for="description">Descriere</Label>
				<Input
					id="description"
					name="description"
					type="text"
					aria-invalid={$errors.description ? 'true' : 'false'}
					required
					bind:value={$form.description}
				/>
				<p class="text-destructive">{$errors.description}</p>
			</div>

			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => (dialogOpen = false)}>
					Anulează
				</Button>
				<Button type="submit" disabled={loading}>Adaugă capitol</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
