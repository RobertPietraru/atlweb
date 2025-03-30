<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { marked } from 'marked';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	let { data } = $props();

	let htmlEditor: Monaco.editor.IStandaloneCodeEditor;
	let cssEditor: Monaco.editor.IStandaloneCodeEditor;
	let jsEditor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;
	let htmlEditorContainer: HTMLElement | null = $state(null);
	let cssEditorContainer: HTMLElement | null = $state(null);
	let jsEditorContainer: HTMLElement | null = $state(null);

    let activeTab : 'html' | 'css' | 'javascript' = $state('html');

	const htmlSnippets = {
		'!': {
			prefix: '!',
			body: [
				'<!DOCTYPE html>',
				'<html lang="en">',
				'<head>',
				'\t<meta charset="UTF-8">',
				'\t<meta name="viewport" content="width=device-width, initial-scale=1.0">',
				'\t<title>Document</title>',
				'</head>',
				'<body>',
				'\t$0',
				'</body>',
				'</html>'
			].join('\n')
		},
		div: {
			prefix: 'div',
			body: ['<div>', '\t$0', '</div>'].join('\n')
		},
		p: {
			prefix: 'p',
			body: ['<p>', '\t$0', '</p>'].join('\n')
		},

		span: {
			prefix: 'span',
			body: ['<span>', '\t$0', '</span>'].join('\n')
		},
		img: {
			prefix: 'img',
			body: ['<img src="$0" alt="Image">', '\t$0', '</img>'].join('\n')
		},
		br: {
			prefix: 'br',
			body: ['<br>'].join('\n')
		},
		hr: {
			prefix: 'hr',
			body: ['<hr>'].join('\n')
		},
		a: {
			prefix: 'a',
			body: ['<a href="$0">Link</a>'].join('\n')
		},
		ul: {
			prefix: 'ul',
			body: ['<ul>', '\t$0', '</ul>'].join('\n')
		},
		li: {
			prefix: 'li',
			body: ['<li>', '\t$0', '</li>'].join('\n')
		},
		ol: {
			prefix: 'ol',
			body: ['<ol>', '\t$0', '</ol>'].join('\n')
		},
		table: {
			prefix: 'table',
			body: ['<table>', '\t$0', '</table>'].join('\n')
		}
	};

	onMount(async () => {
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

		const htmlModel = monaco.editor.createModel(data.exercise.initialHtml, 'html');
		const cssModel = monaco.editor.createModel(data.exercise.initialCss, 'css');
		const jsModel = monaco.editor.createModel(data.exercise.initialJavascript, 'javascript');

		htmlEditor.setModel(htmlModel);
		cssEditor.setModel(cssModel);
		jsEditor.setModel(jsModel);
	});

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		htmlEditor?.dispose();
		cssEditor?.dispose();
		jsEditor?.dispose();
	});
</script>

<Resizable.PaneGroup direction="horizontal" class="">
	<Resizable.Pane
		defaultSize={25}
		onResize={() => {
			console.log('resize');
		}}
	>
		<Resizable.PaneGroup direction="vertical" class="">
			<Resizable.Pane defaultSize={50} class="p-4">
				<h1 class="flex-1 text-xl font-bold">{data.exercise.name}</h1>
				<p>{data.exercise.description}</p>
				<Separator class="my-4" />
				<div class="markdown-content">
					{@html marked(data.exercise.instructions)}
				</div>
			</Resizable.Pane>
			<Resizable.Handle withHandle class="bg-muted" />

			{#if data.submissions.length > 0}
				<Resizable.Pane defaultSize={25}>
					{#each data.submissions as submission}
						<div>
							<p>{submission.id}</p>
						</div>
					{/each}
				</Resizable.Pane>
			{/if}
		</Resizable.PaneGroup>
	</Resizable.Pane>
	<Resizable.Handle withHandle class="bg-muted" />
	<Resizable.Pane defaultSize={60} class="p-0">
		<Tabs.Root class="h-[calc(100vh-4rem)]" bind:value={activeTab}>
			<Tabs.List class="flex justify-start border-b border-muted">
				<Tabs.Trigger value="html" class="rounded-t-lg border border-b-0 border-muted px-4 py-2 text-sm font-medium hover:bg-muted/50 data-[state=active]:bg-background data-[state=active]:border-muted">HTML</Tabs.Trigger>
				<Tabs.Trigger value="css" class="rounded-t-lg border border-b-0 border-muted px-4 py-2 text-sm font-medium hover:bg-muted/50 data-[state=active]:bg-background data-[state=active]:border-muted">CSS</Tabs.Trigger>
				<Tabs.Trigger value="javascript" class="rounded-t-lg border border-b-0 border-muted px-4 py-2 text-sm font-medium hover:bg-muted/50 data-[state=active]:bg-background data-[state=active]:border-muted">JavaScript</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="html" class="h-full w-full">
				<div bind:this={htmlEditorContainer} class="h-full w-full" id="html-editor"></div>
			</Tabs.Content>
			<Tabs.Content value="css" class="h-full w-full">
				<div bind:this={cssEditorContainer} class="h-full w-full" id="css-editor"></div>
			</Tabs.Content>
			<Tabs.Content value="javascript" class="h-full w-full">
				<div bind:this={jsEditorContainer} class="h-full w-full" id="javascript-editor"></div>
			</Tabs.Content>
		</Tabs.Root>
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	<Resizable.Pane defaultSize={30}>
		<div class="flex h-full items-center justify-center p-6">
			<span class="font-semibold">Content</span>
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>

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
