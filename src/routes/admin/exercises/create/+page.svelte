<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { marked } from 'marked';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { PlayIcon } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	let { data } = $props();

	let code = $state({
		html: '',
		css: '',
		javascript: ''
	});
	let form = $state({
		title: '',
		summary: '',
		instructions: ''
	});

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

	onMount(async () => {
		window.addEventListener('keydown', handleKeyDown);
		monaco = (await import('./monaco')).default;

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

		const htmlModel = monaco.editor.createModel('', 'html');
		const cssModel = monaco.editor.createModel('', 'css');
		const jsModel = monaco.editor.createModel('', 'javascript');

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

	function setCode(params: { css: string; html: string; javascript: string }) {
		code.css = params.css;
		code.html = params.html;
		code.javascript = params.javascript;
		htmlEditor?.setValue(params.html);
		cssEditor?.setValue(params.css);
		jsEditor?.setValue(params.javascript);
		toast.success('Codul a fost adus la cel de atunci');
	}
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

<Resizable.PaneGroup direction="horizontal">
	<Resizable.Pane defaultSize={25}>
		<Resizable.PaneGroup direction="vertical" class="">
			<Resizable.Pane defaultSize={50}>
				<Tabs.Root class="h-full" bind:value={activeSidebarTab}>
					<Tabs.List class="w-full border-b">
						<Tabs.Trigger
							value="description"
							class="flex-1 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
							>Descriere</Tabs.Trigger
						>
						<Tabs.Trigger
							value="result"
							class="flex-1 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
							>Rezultat</Tabs.Trigger
						>
					</Tabs.List>

					<Tabs.Content value="description" class="h-full w-full p-4">
						{@render exerciseDescription()}
					</Tabs.Content>

					<Tabs.Content value="result" class="h-full w-full ">
						<div class="flex h-full items-center justify-center">
							{#if lastRunCode !== null}
								<iframe
									title="Code Preview"
									class="h-full w-full"
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
				class="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
				<span>Ruleaza</span>
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
	<ScrollArea class="h-full w-full">
		<Textarea bind:value={form.title} class="h-full w-full" />
		<Textarea bind:value={form.summary} class="h-full w-full" />
		<Separator class="my-4" />
		<Textarea bind:value={form.instructions} class="h-full w-full" />
		<Separator class="my-4" />
		<div class="markdown-content">
			{@html marked(form.instructions)}
		</div>
	</ScrollArea>
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

	:global(.markdown-content hr) {
		@apply my-4;
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
</style>
