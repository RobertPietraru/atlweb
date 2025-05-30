<script lang="ts">
	import { Carta, MarkdownEditor, type Options } from 'carta-md';
	// Component default theme
	import 'carta-md/default.css';

	import { onDestroy, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Loader2, PlayIcon, SaveIcon, TrashIcon, Clipboard } from '@lucide/svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { deserialize } from '$app/forms';
	import { page } from '$app/state';
	import { localizedGoto } from '$lib/utils.js';
	import * as m from '$lib/paraglide/messages.js';
	let { data } = $props();
	const carta = new Carta({} as Options);

	let code = $state({
		html: data.exercise.initialHtml,
		css: data.exercise.initialCss,
		javascript: data.exercise.initialJavascript
	});
	let lastSavedCode = $state({
		html: data.exercise.initialHtml,
		css: data.exercise.initialCss,
		javascript: data.exercise.initialJavascript
	});
	let form = $state({
		title: data.exercise.title,
		summary: data.exercise.summary,
		instructions: data.exercise.instructions
	});
	let lastSavedForm = $state({
		title: data.exercise.title,
		summary: data.exercise.summary,
		instructions: data.exercise.instructions
	});
	let isSaving = $state(false);

	let isSaved = $derived(
		JSON.stringify($state.snapshot(lastSavedCode)) === JSON.stringify($state.snapshot(code)) &&
			JSON.stringify($state.snapshot(lastSavedForm)) === JSON.stringify($state.snapshot(form))
	);

	let lastRunCode: { html: string; css: string; javascript: string } | null = $state(null);
	let handleKeyDown = (e: KeyboardEvent) => {
		if ((e.ctrlKey || e.metaKey) && e.key === 's') {
			e.preventDefault();
			activeSidebarTab = 'result';
			if (JSON.stringify($state.snapshot(lastRunCode)) !== JSON.stringify($state.snapshot(code))) {
				lastRunCode = structuredClone($state.snapshot(code));
			} else {
				lastRunCode = null;
				setTimeout(() => {
					lastRunCode = structuredClone($state.snapshot(code));
				}, 0);
			}
			save();
		}
	};

	let htmlEditor: Monaco.editor.IStandaloneCodeEditor;
	let cssEditor: Monaco.editor.IStandaloneCodeEditor;
	let jsEditor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;
	let htmlEditorContainer: HTMLElement | null = $state(null);
	let cssEditorContainer: HTMLElement | null = $state(null);
	let jsEditorContainer: HTMLElement | null = $state(null);

	let activeCodeTab: 'html' | 'css' | 'javascript' = $state('html');
	/// different tabs
	let activeSidebarTab: 'result' | 'description' = $state('description');

	async function save() {
		try {
			isSaving = true;
			const formData = new FormData();
			if (code.html !== lastSavedCode.html) {
				formData.append('html', code.html);
			}
			if (code.css !== lastSavedCode.css) {
				formData.append('css', code.css);
			}
			if (code.javascript !== lastSavedCode.javascript) {
				formData.append('javascript', code.javascript);
			}
			if (form.title !== lastSavedForm.title) {
				formData.append('title', form.title);
			}
			if (form.summary !== lastSavedForm.summary) {
				formData.append('summary', form.summary);
			}
			if (form.instructions !== lastSavedForm.instructions) {
				formData.append('instructions', form.instructions);
			}

			const response = await fetch('?/update', {
				method: 'POST',
				body: formData
			});

			const result = deserialize(await response.text());
			if (result.type === 'success') {
				toast.success(m.exercise_save_success());

				lastSavedCode = structuredClone($state.snapshot(code));
				lastSavedForm = structuredClone($state.snapshot(form));

				console.log(result.data);
			} else if (result.type === 'failure') {
				toast.error(
					(result.data?.message as string | undefined | null) ?? m.exercise_save_error(),
					{
						position: 'bottom-left'
					}
				);
			}
		} catch (error) {
			console.error(error);
			toast.error(m.exercise_save_error());
		} finally {
			isSaving = false;
		}
	}
	async function deleteExercise() {
		try {
			isSaving = true;
			const formData = new FormData();
			const response = await fetch('?/delete', {
				method: 'POST',
				body: formData
			});

			const result = deserialize(await response.text());
			if (result.type === 'redirect') {
				toast.success(m.exercise_delete_success());
				localizedGoto(page.url.toString(), result.location);
			} else if (result.type === 'failure') {
				toast.error(
					(result.data?.message as string | undefined | null) ?? m.exercise_delete_error(),
					{
						position: 'bottom-left'
					}
				);
			}
		} catch (error) {
			console.error(error);
			toast.error(m.exercise_delete_error());
		} finally {
			isSaving = false;
		}
	}
	onMount(async () => {
		window.addEventListener('keydown', handleKeyDown);
		monaco = (await import('./monaco.js')).default;

		htmlEditor = monaco.editor.create(htmlEditorContainer!, {
			theme: 'vs-dark',
			automaticLayout: true,

			language: 'html'
		});

		cssEditor = monaco.editor.create(cssEditorContainer!, {
			theme: 'vs-dark',
			automaticLayout: true,
			language: 'css'
		});

		jsEditor = monaco.editor.create(jsEditorContainer!, {
			theme: 'vs-dark',
			automaticLayout: true,
			language: 'javascript'
		});

		const htmlModel = monaco.editor.createModel(data.exercise.initialHtml, 'html');
		const cssModel = monaco.editor.createModel(data.exercise.initialCss, 'css');
		const jsModel = monaco.editor.createModel(data.exercise.initialJavascript, 'javascript');

		htmlEditor.setModel(htmlModel);
		cssEditor.setModel(cssModel);
		jsEditor.setModel(jsModel);
		htmlEditor.onDidChangeModelContent(() => {
			code.html = htmlEditor.getValue();
		});

		cssEditor.onDidChangeModelContent(() => {
			code.css = cssEditor.getValue();
		});

		jsEditor.onDidChangeModelContent(() => {
			code.javascript = jsEditor.getValue();
		});
	});

	function getCodePreview(params: { css: string; html: string; javascript: string }) {
		const css = params.css ?? '';
		const html = params.html ?? '';
		const javascript = params.javascript ?? '';

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

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		htmlEditor?.dispose();
		cssEditor?.dispose();
		jsEditor?.dispose();
	});
</script>

<main class="mx-0 min-h-[100vh] w-full">
	<Resizable.PaneGroup direction="horizontal">
		<Resizable.Pane defaultSize={25}>
			<Resizable.PaneGroup direction="vertical" class="">
				<Resizable.Pane defaultSize={50}>
					<Tabs.Root class="h-full" bind:value={activeSidebarTab}>
						<Tabs.List class="w-full border-b">
							<Tabs.Trigger
								value="description"
								class="flex-1 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
								>{m.exercise_description_tab()}</Tabs.Trigger
							>
							<Tabs.Trigger
								value="result"
								class="flex-1 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
								>{m.exercise_result_tab()}</Tabs.Trigger
							>
						</Tabs.List>

						<Tabs.Content value="description" class="h-full w-full pr-2">
							{@render exerciseDescription()}
						</Tabs.Content>

						<Tabs.Content value="result" class="h-full w-full ">
							<div class="flex h-full items-center justify-center">
								{#if lastRunCode !== null}
									<iframe
										title="Code Preview"
										class="h-full w-full bg-white"
										srcdoc={getCodePreview(lastRunCode)}
										sandbox="allow-scripts"
									></iframe>
								{/if}
							</div>
						</Tabs.Content>
					</Tabs.Root>
				</Resizable.Pane>
			</Resizable.PaneGroup>
		</Resizable.Pane>
		<Resizable.Handle withHandle class="bg-muted" />
		<Resizable.Pane class="p-0">
			{@render editor()}
		</Resizable.Pane>
		<Resizable.Handle withHandle />
	</Resizable.PaneGroup>
</main>
{#snippet editor()}
	<Tabs.Root class="h-[calc(100vh-4rem)]" bind:value={activeCodeTab}>
		<div class="flex items-center gap-4">
			<Tabs.List class="m-0 p-0">
				<Tabs.Trigger
					value="html"
					class="m-0  h-full flex-1 rounded-t-md data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-white"
					>HTML</Tabs.Trigger
				>
				<Tabs.Trigger
					value="css"
					class="m-0  h-full flex-1 rounded-t-md data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-white"
					>CSS</Tabs.Trigger
				>
				<Tabs.Trigger
					value="javascript"
					class="m-0  h-full flex-1 rounded-t-md data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-white"
					>JavaScript</Tabs.Trigger
				>
			</Tabs.List>
			<div class="flex-1"></div>

			<Button
				disabled={isSaving}
				onclick={() => {
					navigator.clipboard.writeText(data.exercise.id);
					toast.success(m.exercise_copy_id());
				}}
			>
				<Clipboard class="size-4" />
			</Button>

			<Button disabled={isSaving} onclick={deleteExercise} variant="destructive">
				{#if isSaving}
					<Loader2 class="size-4 animate-spin" />
				{:else}
					<TrashIcon class="size-4" />
				{/if}
				<span>{m.exercise_delete()}</span>
			</Button>

			<Button disabled={isSaved || isSaving} onclick={save}>
				{#if isSaving}
					<Loader2 class="size-4 animate-spin" />
				{:else}
					<SaveIcon class="size-4" />
				{/if}
				<span>{m.exercise_save()}</span>
			</Button>

			<Button
				disabled={isSaving}
				onclick={async () => {
					activeSidebarTab = 'result';
					if (
						JSON.stringify($state.snapshot(lastRunCode)) !== JSON.stringify($state.snapshot(code))
					) {
						lastRunCode = structuredClone($state.snapshot(code));
					} else {
						lastRunCode = null;
						await new Promise((resolve) => setTimeout(resolve, 0));
						lastRunCode = structuredClone($state.snapshot(code));
					}
				}}
			>
				<PlayIcon class="size-4" />
				<span>{m.exercise_run()}</span>
			</Button>
		</div>
		<Tabs.Content value="html" class="mt-0 h-full w-full ">
			<div bind:this={htmlEditorContainer} class="h-full w-full" id="html-editor"></div>
		</Tabs.Content>
		<Tabs.Content value="css" class="mt-0 h-full w-full ">
			<div bind:this={cssEditorContainer} class="h-full w-full" id="css-editor"></div>
		</Tabs.Content>
		<Tabs.Content value="javascript" class="mt-0 h-full w-full ">
			<div bind:this={jsEditorContainer} class="h-full w-full" id="javascript-editor"></div>
		</Tabs.Content>
	</Tabs.Root>
{/snippet}

{#snippet exerciseDescription()}
	<ScrollArea class="h-full w-full ">
		<Input bind:value={form.title} class="mb-4 w-full" placeholder={m.exercise_title_placeholder()} />
		<Textarea bind:value={form.summary} class=" mb-4 w-full" placeholder={m.exercise_summary_placeholder()} />
		<div class="bg-white" style="border-radius: 4px; color: black">
			<MarkdownEditor bind:value={form.instructions} {carta} />
		</div>
	</ScrollArea>
{/snippet}

<style>
	:global(.overflow-table) {
		@apply my-6 w-full overflow-y-auto;
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
	:global(.tab-trigger) {
		@apply inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm;
	}
	:global(.carta-font-code) {
		font-family: '...', monospace;
		font-size: 1.1rem;
		line-height: 1.1rem;
		letter-spacing: normal;
	}
	html.dark .carta-theme__default {
		--border-color: var(--border-color-dark);
		--selection-color: var(--selection-color-dark);
		--focus-outline: var(--focus-outline-dark);
		--hover-color: var(--hover-color-dark);
		--caret-color: var(--caret-color-dark);
		--text-color: var(--text-color-dark);
	}
</style>
