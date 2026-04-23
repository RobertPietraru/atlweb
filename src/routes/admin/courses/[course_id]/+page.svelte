<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import { createChapter, updateCourse, manageChapters } from './course.remote';
	import { Loader2, ChevronUp, ChevronDown, PlusIcon, SaveIcon, PencilIcon, XIcon } from '@lucide/svelte';
	import { untrack } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();
	let chapters = $state(untrack(() => data.course.chapters.map((ch) => ({ ...ch }))));
	let initialChapters = untrack(() => data.course.chapters);
	let hasChanges = $derived(JSON.stringify(chapters) !== JSON.stringify(initialChapters));
	let saving = $state(false);
	let savingOrder = $state(false);
	let creatingChapter = $state(false);
	let isEditing = $state(false);
	let editForm = $state(untrack(() => ({
		name: data.course.name,
		description: data.course.description
	})));

	function moveChapter(index: number, direction: 'up' | 'down') {
		if (direction === 'up' && index > 0) {
			const temp = chapters[index];
			chapters[index] = chapters[index - 1];
			chapters[index - 1] = temp;
		} else if (direction === 'down' && index < chapters.length - 1) {
			const temp = chapters[index];
			chapters[index] = chapters[index + 1];
			chapters[index + 1] = temp;
		}
		chapters = chapters.map((ch, idx) => ({ ...ch, order: idx + 1 }));
	}

	async function saveChapterOrder() {
		savingOrder = true;
		try {
			await manageChapters({
				courseId: data.course.id,
				chapters: chapters.map((ch) => ch.id)
			});
			initialChapters = [...chapters];
			toast.success(m.admin_course_save_chapter_order(), { position: 'bottom-left' });
		} catch {
			toast.error(m.admin_course_save_chapter_order_error(), { position: 'bottom-left' });
		} finally {
			savingOrder = false;
		}
	}

	async function saveCourseInfo() {
		saving = true;
		try {
			await updateCourse({
				courseId: data.course.id,
				name: editForm.name,
				description: editForm.description
			});
			data.course.name = editForm.name;
			data.course.description = editForm.description;
			isEditing = false;
			toast.success(m.admin_course_save_info_success(), { position: 'bottom-left' });
		} catch {
			toast.error(m.admin_course_save_info_error(), { position: 'bottom-left' });
		} finally {
			saving = false;
		}
	}

	async function handleCreateChapter() {
		creatingChapter = true;
		try {
			await createChapter({ courseId: data.course.id });
			await invalidateAll();
			chapters = data.course.chapters.map((ch) => ({ ...ch }));
			initialChapters = [...data.course.chapters];
		} finally {
			creatingChapter = false;
		}
	}

	function deleteChapter(index: number) {
		chapters = chapters.filter((_, i) => i !== index);
	}
</script>

<div class="mx-auto max-w-3xl">
	<div class="mb-8">
		<h1 class="font-display text-3xl font-bold tracking-tight">
			{m.admin_course_title({ name: data.course.name })}
		</h1>
	</div>

	<div class="grid gap-8">
		<!-- Basic info -->
		<section class="rounded-xl border bg-card shadow-sm">
			<div class="flex items-center justify-between border-b px-6 py-4">
				<h2 class="font-display text-base font-semibold">{m.admin_course_basic_info()}</h2>
				{#if !isEditing}
					<Button variant="ghost" size="sm" onclick={() => (isEditing = true)} class="gap-1.5">
						<PencilIcon class="h-3.5 w-3.5" />
						{m.admin_course_edit()}
					</Button>
				{/if}
			</div>
			<div class="space-y-5 p-6">
				{#if isEditing}
					<div class="space-y-1.5">
						<Label for="name">{m.admin_course_name()}</Label>
						<Input id="name" bind:value={editForm.name} disabled={saving} />
					</div>
					<div class="space-y-1.5">
						<Label for="description">{m.admin_course_description()}</Label>
						<Textarea id="description" bind:value={editForm.description} disabled={saving} />
					</div>
					<div class="flex gap-2">
						<Button onclick={saveCourseInfo} disabled={saving} class="gap-2">
							{#if saving}
								<Loader2 class="h-4 w-4 animate-spin" />
							{:else}
								<SaveIcon class="h-4 w-4" />
							{/if}
							{m.admin_course_save()}
						</Button>
						<Button variant="outline" onclick={() => (isEditing = false)} disabled={saving} class="gap-2">
							<XIcon class="h-4 w-4" />
							{m.admin_course_cancel()}
						</Button>
					</div>
				{:else}
					<div>
						<p class="mb-0.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">{m.admin_course_name()}</p>
						<p class="font-medium">{data.course.name}</p>
					</div>
					<div>
						<p class="mb-0.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">{m.admin_course_description()}</p>
						<p class="leading-relaxed text-muted-foreground">{data.course.description}</p>
					</div>
				{/if}
			</div>
		</section>

		<!-- Chapters -->
		<section class="rounded-xl border bg-card shadow-sm">
			<div class="flex items-center justify-between border-b px-6 py-4">
				<h2 class="font-display text-base font-semibold">{m.admin_course_chapters()}</h2>
				<Button onclick={handleCreateChapter} disabled={creatingChapter} size="sm" class="gap-2">
					{#if creatingChapter}
						<Loader2 class="h-4 w-4 animate-spin" />
					{:else}
						<PlusIcon class="h-4 w-4" />
					{/if}
					{m.admin_course_add_chapter()}
				</Button>
			</div>

			<div class="p-6">
				{#if hasChanges}
					<Button
						variant="default"
						onclick={saveChapterOrder}
						disabled={savingOrder}
						class="mb-4 w-full gap-2"
					>
						{#if savingOrder}
							<Loader2 class="h-4 w-4 animate-spin" />
						{:else}
							<SaveIcon class="h-4 w-4" />
						{/if}
						{m.admin_course_save_chapter_order()}
					</Button>
				{/if}

				{#if chapters.length === 0}
					<p class="py-8 text-center text-sm text-muted-foreground">{m.admin_course_no_chapters()}</p>
				{:else}
					<div class="space-y-2">
						{#each chapters as chapter, index}
							<div class="flex items-center gap-3 rounded-lg border bg-background px-4 py-3">
								<div class="flex flex-col gap-0.5">
									<button
										class="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
										disabled={index === 0}
										onclick={() => moveChapter(index, 'up')}
									>
										<ChevronUp class="h-4 w-4" />
									</button>
									<button
										class="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
										disabled={index === chapters.length - 1}
										onclick={() => moveChapter(index, 'down')}
									>
										<ChevronDown class="h-4 w-4" />
									</button>
								</div>
								<span class="min-w-0 flex-1 font-medium">{chapter.name}</span>
								<div class="flex shrink-0 gap-2">
									<Button
										variant="outline"
										size="sm"
										href="/admin/courses/{data.course.id}/chapters/{chapter.id}"
									>
										{m.admin_course_edit_chapter()}
									</Button>
									<Button variant="destructive" size="sm" onclick={() => deleteChapter(index)}>
										{m.admin_course_delete_chapter()}
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
