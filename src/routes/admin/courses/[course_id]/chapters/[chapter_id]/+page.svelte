<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as m from '$lib/paraglide/messages.js';
	import { createLesson, updateChapter, manageLessons } from './chapter.remote';
	import { Loader2, ChevronUp, ChevronDown, PlusIcon, SaveIcon, PencilIcon, XIcon } from '@lucide/svelte';
	import { untrack } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();
	let lessons = $state(untrack(() => data.chapter.lessons.map((l) => ({ ...l }))));
	let initialLessons = untrack(() => data.chapter.lessons);
	let hasChanges = $derived(JSON.stringify(lessons) !== JSON.stringify(initialLessons));

	let savingInfo = $state(false);
	let savingOrder = $state(false);
	let creatingLesson = $state(false);
	let isEditing = $state(false);
	let editForm = $state(untrack(() => ({
		name: data.chapter.name,
		description: data.chapter.description
	})));

	function moveLesson(index: number, direction: 'up' | 'down') {
		if (direction === 'up' && index > 0) {
			const temp = lessons[index];
			lessons[index] = lessons[index - 1];
			lessons[index - 1] = temp;
		} else if (direction === 'down' && index < lessons.length - 1) {
			const temp = lessons[index];
			lessons[index] = lessons[index + 1];
			lessons[index + 1] = temp;
		}
		lessons = lessons.map((l, idx) => ({ ...l, order: idx + 1 }));
	}

	async function saveLessonOrder() {
		savingOrder = true;
		try {
			await manageLessons({
				chapterId: data.chapter.id,
				lessons: lessons.map((l) => l.id)
			});
			initialLessons = [...lessons];
			toast.success(m.admin_chapter_save_info_success(), { position: 'bottom-left' });
		} catch {
			toast.error(m.admin_chapter_save_lesson_order_error(), { position: 'bottom-left' });
		} finally {
			savingOrder = false;
		}
	}

	async function saveChapterInfo() {
		savingInfo = true;
		try {
			await updateChapter({
				chapterId: data.chapter.id,
				name: editForm.name,
				description: editForm.description
			});
			data.chapter.name = editForm.name;
			data.chapter.description = editForm.description;
			isEditing = false;
			toast.success(m.admin_chapter_save_info_success(), { position: 'bottom-left' });
		} catch {
			toast.error(m.admin_chapter_save_info_error(), { position: 'bottom-left' });
		} finally {
			savingInfo = false;
		}
	}

	async function handleCreateLesson() {
		creatingLesson = true;
		try {
			await createLesson({ courseId: data.courseId, chapterId: data.chapter.id });
			await invalidateAll();
			lessons = data.chapter.lessons.map((l) => ({ ...l }));
			initialLessons = [...data.chapter.lessons];
		} finally {
			creatingLesson = false;
		}
	}

	function deleteLesson(index: number) {
		lessons = lessons.filter((_, i) => i !== index);
	}
</script>

<div class="mx-auto max-w-3xl">
	<div class="mb-8">
		<h1 class="font-display text-3xl font-bold tracking-tight">
			{m.admin_chapter_title({ name: data.chapter.name })}
		</h1>
	</div>

	<div class="grid gap-8">
		<!-- Basic info -->
		<section class="rounded-xl border bg-card shadow-sm">
			<div class="flex items-center justify-between border-b px-6 py-4">
				<h2 class="font-display text-base font-semibold">{m.admin_chapter_basic_info()}</h2>
				{#if !isEditing}
					<Button variant="ghost" size="sm" onclick={() => (isEditing = true)} class="gap-1.5">
						<PencilIcon class="h-3.5 w-3.5" />
						{m.admin_chapter_edit()}
					</Button>
				{/if}
			</div>
			<div class="space-y-5 p-6">
				{#if isEditing}
					<div class="space-y-1.5">
						<Label for="name">{m.admin_chapter_name()}</Label>
						<Input id="name" bind:value={editForm.name} disabled={savingInfo} />
					</div>
					<div class="space-y-1.5">
						<Label for="description">{m.admin_chapter_description()}</Label>
						<Textarea id="description" bind:value={editForm.description} disabled={savingInfo} />
					</div>
					<div class="flex gap-2">
						<Button onclick={saveChapterInfo} disabled={savingInfo} class="gap-2">
							{#if savingInfo}
								<Loader2 class="h-4 w-4 animate-spin" />
							{:else}
								<SaveIcon class="h-4 w-4" />
							{/if}
							{m.admin_chapter_save()}
						</Button>
						<Button variant="outline" onclick={() => (isEditing = false)} disabled={savingInfo} class="gap-2">
							<XIcon class="h-4 w-4" />
							{m.admin_chapter_cancel()}
						</Button>
					</div>
				{:else}
					<div>
						<p class="mb-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">{m.admin_chapter_name()}</p>
						<p class="font-medium">{data.chapter.name}</p>
					</div>
					<div>
						<p class="mb-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">{m.admin_chapter_description()}</p>
						<p class="leading-relaxed text-muted-foreground">{data.chapter.description}</p>
					</div>
				{/if}
			</div>
		</section>

		<!-- Lessons -->
		<section class="rounded-xl border bg-card shadow-sm">
			<div class="flex items-center justify-between border-b px-6 py-4">
				<h2 class="font-display text-base font-semibold">{m.admin_chapter_lessons()}</h2>
				<Button onclick={handleCreateLesson} disabled={creatingLesson} size="sm" class="gap-2">
					{#if creatingLesson}
						<Loader2 class="h-4 w-4 animate-spin" />
					{:else}
						<PlusIcon class="h-4 w-4" />
					{/if}
					{m.admin_chapter_add_lesson()}
				</Button>
			</div>

			<div class="p-6">
				{#if hasChanges}
					<Button
						variant="default"
						onclick={saveLessonOrder}
						disabled={savingOrder}
						class="mb-4 w-full gap-2"
					>
						{#if savingOrder}
							<Loader2 class="h-4 w-4 animate-spin" />
						{:else}
							<SaveIcon class="h-4 w-4" />
						{/if}
						{m.admin_chapter_save()}
					</Button>
				{/if}

				{#if lessons.length === 0}
					<p class="py-8 text-center text-sm text-muted-foreground">{m.admin_chapter_no_lessons()}</p>
				{:else}
					<div class="space-y-2">
						{#each lessons as lesson, index}
							<div class="flex items-center gap-3 rounded-lg border bg-background px-4 py-3">
								<div class="flex flex-col gap-0.5">
									<button
										class="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
										disabled={index === 0}
										onclick={() => moveLesson(index, 'up')}
									>
										<ChevronUp class="h-4 w-4" />
									</button>
									<button
										class="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
										disabled={index === lessons.length - 1}
										onclick={() => moveLesson(index, 'down')}
									>
										<ChevronDown class="h-4 w-4" />
									</button>
								</div>
								<span class="min-w-0 flex-1 font-medium">{lesson.name}</span>
								<div class="flex shrink-0 gap-2">
									<Button
										variant="outline"
										size="sm"
										href="/admin/courses/{data.courseId}/chapters/{data.chapter.id}/lessons/{lesson.id}"
									>
										{m.admin_chapter_edit_lesson()}
									</Button>
									<Button variant="destructive" size="sm" onclick={() => deleteLesson(index)}>
										{m.admin_chapter_delete_lesson()}
									</Button>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</section>
	</div>
</div>
