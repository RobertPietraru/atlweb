<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { marked } from 'marked';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { page } from '$app/state';
	import {
		CheckIcon,
		ChevronDown,
		EyeIcon,
		HelpCircleIcon,
		Loader2,
		PlayIcon,
		Send,
		TrashIcon,
		UserIcon
	} from 'lucide-svelte';
	import { deserialize } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	let { data } = $props();

	let code = $state({
		html: data.exercise.initialHtml,
		css: data.exercise.initialCss,
		javascript: data.exercise.initialJavascript
	});
	let submitPopupOpen = $state(false);
	let submitPopupRef = $state<HTMLButtonElement | null>(null);

	let submissions = $state(data.submissions);
	let deleting = $state<string[]>([]);
	$inspect(deleting);

	let lastRunCode: { html: string; css: string; javascript: string } | null = $state(null);
	let submittedCode: { html: string; css: string; javascript: string } | null = $state(null);
	let currentCodeAndSubmittedCodeAreTheSame = $derived(
		JSON.stringify($state.snapshot(code)) === JSON.stringify($state.snapshot(submittedCode))
	);
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
	let activeSidebarTab: 'result' | 'submissions' | 'description' = $state('description');

	let submitting = $state(false);

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

	async function submitCode(params: { needHelp: boolean; anonymous: boolean }) {
		try {
			submitting = true;
			submitPopupOpen = false;
			const formData = new FormData();
			formData.append('html', code.html);
			formData.append('css', code.css);
			formData.append('javascript', code.javascript);
			formData.append('needHelp', params.needHelp.toString());
			formData.append('anonymous', params.anonymous.toString());
			const response = await fetch('?/submit', {
				method: 'POST',
				body: formData
			});

			const result = deserialize(await response.text());
			if (result.type === 'success') {
				submittedCode = structuredClone($state.snapshot(code));
				toast.success('Codul a fost trimis cu succes');

				console.log(result.data);
				submissions = [result.data?.submission as (typeof submissions)[0], ...submissions];
			} else if (result.type === 'failure') {
				toast.error(
					(result.data?.message as string | undefined | null) ??
						'A apărut o eroare la trimiterea codului',
					{
						position: 'bottom-left'
					}
				);
			}
		} catch (error) {
			console.error(error);
			toast.error('A apărut o eroare la trimiterea codului');
		} finally {
			submitting = false;
		}
	}

	async function deleteSubmission(submissionId: string) {
		try {
			const formData = new FormData();
			deleting.push(submissionId);
			formData.append('submissionId', submissionId);
			const response = await fetch('?/delete', {
				method: 'POST',
				body: formData
			});

			const result = deserialize(await response.text());
			if (result.type === 'success') {
				toast.success('Raspunsul a fost sters cu succes');
				submissions.splice(
					submissions.findIndex((submission) => submission.id === submissionId),
					1
				);
			} else if (result.type === 'failure') {
				toast.error(
					(result.data?.message as string | undefined | null) ??
						'A apărut o eroare la stergerea raspunsului',
					{
						position: 'bottom-left'
					}
				);
			}
		} catch (error) {
			toast.error('A apărut o eroare la stergerea raspunsului');
		} finally {
			deleting.splice(
				deleting.findIndex((id) => id === submissionId),
				1
			);
		}
	}

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		htmlEditor?.dispose();
		cssEditor?.dispose();
		jsEditor?.dispose();
	});
</script>

<Resizable.PaneGroup direction="horizontal">
	<Resizable.Pane
		defaultSize={25}
		
	>
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
						<Tabs.Trigger
							value="submissions"
							class="flex-1 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
							>Solutii</Tabs.Trigger
						>
					</Tabs.List>
					<Tabs.Content value="submissions" class="h-full w-full p-4">
						{@render submissionsTable()}
					</Tabs.Content>

					<Tabs.Content value="description" class="h-full w-full p-4">
						{@render exerciseDescription()}
					</Tabs.Content>

					<Tabs.Content value="result" class="h-full w-full ">
						<div class="flex h-full items-center justify-center">
							{#if lastRunCode !== null }
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

			{#if data.isHelper}
				<Button
					class="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
					href="./{data.exercise.id}/submissions"
				>
					<UserIcon class="size-4" />
					<span>Solutii</span>
				</Button>
			{/if}
			{@render submitButton()}

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
{#snippet submissionsTable()}
	<ScrollArea class="h-full w-full">
		<table class="w-full border-collapse">
			<thead>
				<tr class="border-b">
					<th class="py-2 text-left"></th>
					<th class="py-2 text-left">Data</th>
					<th class="py-2 text-left">Status</th>
					<th class="py-2 text-left">Anonim</th>
					<th class="py-2 text-left"></th>
				</tr>
			</thead>
			<tbody>
				{#each submissions as submission}
					<tr class="border-b hover:bg-muted/50">
						<td class="py-2">
							<Button
								variant="ghost"
								size="icon"
								class="size-6"
								onclick={() => {
									setCode({
										css: submission.cssCode,
										html: submission.htmlCode,
										javascript: submission.javascriptCode
									});
								}}
							>
								<EyeIcon class="size-4" />
							</Button>
						</td>
						<td class="py-2">
							{new Date(submission.submissionDate).toLocaleString().split(',')[1]}
						</td>
						<td class="py-2">
							{#if submission.needHelp}
								{#if submission.checked}
									<span class="text-green-500">Verificat</span>
								{:else}
									<span class="text-yellow-500">Ajutor solicitat</span>
								{/if}
							{:else}
								<span class="text-green-500">Trimis</span>
							{/if}
						</td>
						<td class="py-2">
							{#if submission.anonymous}
								<span class="text-gray-500">Da</span>
							{:else}
								<span class="text-gray-500">Nu</span>
							{/if}
						</td>
						<td class="py-2">
							<Button
								variant="ghost"
								size="icon"
								class="rounded-full bg-destructive text-destructive-foreground"
								onclick={() => deleteSubmission(submission.id)}
								disabled={deleting.includes(submission.id)}
							>
								{#if deleting.includes(submission.id)}
									<Loader2 class="size-4 animate-spin" />
								{:else}
									<TrashIcon class="size-4" />
								{/if}
							</Button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</ScrollArea>
{/snippet}
{#snippet exerciseDescription()}
	<h1 class="flex-1 text-xl font-bold">{data.exercise.name}</h1>
	<p>{data.exercise.description}</p>
	<Separator class="my-4" />
	<div class="markdown-content">
		{@html marked(data.exercise.instructions)}
	</div>
{/snippet}
{#snippet submitButton()}
	<Popover.Root bind:open={submitPopupOpen}>
		<Popover.Trigger
			bind:ref={submitPopupRef}
			disabled={submitting || currentCodeAndSubmittedCodeAreTheSame}
		>
			{#snippet child({ props })}
				<Button {...props} aria-expanded={submitPopupOpen} class="h-10">
					{#if submitting}
						<Loader2 class="size-4 animate-spin" />
					{:else}
						<Send class="size-4" />
					{/if}
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class=" w-[250px] space-y-0 rounded-md p-0">
			<Button
				variant="ghost"
				disabled={submitting || currentCodeAndSubmittedCodeAreTheSame}
				class="w-full justify-start rounded-t-md"
				onclick={() => submitCode({ needHelp: false, anonymous: false })}
			>
				<CheckIcon class="size-4" />
				Trimite
			</Button>

			<Separator class="my-2" />

			<Button
				variant="ghost"
				disabled={submitting || currentCodeAndSubmittedCodeAreTheSame}
				class="w-full justify-start rounded-b-none"
				onclick={() => submitCode({ needHelp: true, anonymous: false })}
			>
				<HelpCircleIcon class="size-4" />
				Cere ajutor
			</Button>

			<Button
				disabled={submitting || currentCodeAndSubmittedCodeAreTheSame}
				variant="ghost"
				class="w-full justify-start rounded-b-md"
				onclick={() => submitCode({ needHelp: true, anonymous: true })}
			>
				<UserIcon class="size-4" />
				Cere ajutor anonim
			</Button>
		</Popover.Content>
	</Popover.Root>
{/snippet}
<svelte:head>
	<title>{data.exercise.name} | atl.vercel.app</title>
	<meta name="description" content={data.exercise.description} />
	<meta property="og_site_name" content="atl.vercel.app" />
	<meta property="og:url" content="https://atl.vercel.app{page.url.pathname.toString()}" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={data.exercise.name} />
	<meta property="og:description" content={data.exercise.description} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="atl.vercel.app" />
	<meta property="twitter:url" content="https://atl.vercel.app{page.url.pathname.toString()}" />
	<meta name="twitter:title" content={data.exercise.name} />
	<meta name="twitter:description" content={data.exercise.description} />
	{@html `<script type="application/ld+json">{
   "@context": "https://schema.org",
   "@type": "Website",
   "name": "${data.exercise.name} | atl.vercel.app",
   "url": "https://atl.vercel.app${page.url.pathname}",
   "description": "${data.exercise.description}"
   }</script>`}
</svelte:head>

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
