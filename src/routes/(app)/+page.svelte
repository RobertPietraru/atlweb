<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ArrowRightIcon, BookOpenIcon, ZapIcon, GiftIcon, LayersIcon, CodeIcon, CheckCircle2Icon } from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';

	let displayed = $state('');
	let cursorVisible = $state(true);
	let typing = $state(true);

	onMount(() => {
		const full = m.home_title();
		let i = 0;
		const tick = () => {
			if (i < full.length) {
				displayed = full.slice(0, ++i);
				setTimeout(tick, 48);
			} else {
				typing = false;
				setTimeout(() => { cursorVisible = false; }, 1800);
			}
		};
		setTimeout(tick, 350);
	});
</script>

<!-- Hero -->
<section class="relative overflow-hidden">
	<!-- Subtle grid background -->
	<div
		class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"
	></div>
	<!-- Radial fade over grid -->
	<div
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--background))_40%,transparent_100%)]"
	></div>

	<div class="relative mx-auto max-w-[1280px] px-6 py-24 md:py-36">
		<div class="mx-auto max-w-3xl text-center">
			<!-- Eyebrow badge -->
			<div class="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
				<span class="h-2 w-2 rounded-full bg-primary"></span>
				{m.home_interactive_courses_title()}
			</div>

			<h1 class="mb-6 font-display text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
				{m.brand_name()} —
				<span class="bg-gradient-to-r from-primary via-blue-500 to-blue-400 bg-clip-text text-transparent">{displayed}</span><span
					class="inline-block w-[3px] translate-y-[2px] rounded-sm bg-primary align-middle transition-opacity duration-500"
					class:opacity-0={!cursorVisible}
					class:cursor-blink={!typing}
					style="height: 0.85em"
				></span>
			</h1>

			<p class="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
				{m.home_subtitle()}
			</p>

			<div class="flex flex-wrap justify-center gap-4">
				<Button href="/courses" size="lg" class="gap-2 px-8 font-display font-semibold shadow-md shadow-primary/20">
					{m.home_start_learning()}
					<ArrowRightIcon class="h-4 w-4" />
				</Button>
				<Button
					href="https://github.com/RobertPietraru/atlweb"
					variant="outline"
					size="lg"
					class="gap-2 px-8 font-display font-semibold"
				>
					{m.home_github_repository()}
					<svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
							fill="currentColor"
							fill-rule="evenodd"
							clip-rule="evenodd"
						></path>
					</svg>
				</Button>
			</div>
		</div>
	</div>
</section>

<!-- How it works -->
<section class="mx-auto max-w-[1280px] px-6 pb-24">
	<div class="mb-14 text-center">
		<h2 class="mb-3 font-display text-3xl font-bold text-foreground">{m.home_how_title()}</h2>
		<p class="text-muted-foreground">{m.home_how_subtitle()}</p>
	</div>

	<div class="relative grid gap-8 md:grid-cols-3">
		<!-- connector lines on desktop -->
		<div class="pointer-events-none absolute left-[33%] right-[33%] top-7 hidden h-px bg-border md:block"></div>

		{#each [
			{ num: '01', title: m.home_step1_title(), desc: m.home_step1_desc(), icon: BookOpenIcon },
			{ num: '02', title: m.home_step2_title(), desc: m.home_step2_desc(), icon: LayersIcon },
			{ num: '03', title: m.home_step3_title(), desc: m.home_step3_desc(), icon: ZapIcon }
		] as step}
			<div class="flex flex-col items-center text-center md:items-center">
				<div class="relative mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/30 bg-background ring-4 ring-background">
					<step.icon class="h-6 w-6 text-primary" />
					<span class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{step.num}</span>
				</div>
				<h3 class="mb-2 font-display text-lg font-semibold text-foreground">{step.title}</h3>
				<p class="max-w-xs text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Code example section -->
<section class="bg-muted/30 border-y border-border py-24">
	<div class="mx-auto max-w-[1280px] px-6">
		<div class="grid items-center gap-16 lg:grid-cols-2">
			<div>
				<div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<CodeIcon class="h-6 w-6" />
				</div>
				<h2 class="mb-4 font-display text-4xl font-bold tracking-tight text-foreground">
					{m.home_editor_title()}
				</h2>
				<p class="mb-8 text-lg text-muted-foreground">
					{m.home_editor_subtitle()}
				</p>

				<ul class="space-y-4">
					{#each [
						{ title: m.home_editor_feature1_title(), desc: m.home_editor_feature1_desc() },
						{ title: m.home_editor_feature2_title(), desc: m.home_editor_feature2_desc() },
						{ title: m.home_editor_feature3_title(), desc: m.home_editor_feature3_desc() }
					] as feature}
						<li class="flex gap-3">
							<CheckCircle2Icon class="mt-1 h-5 w-5 text-primary" />
							<div>
								<span class="font-semibold text-foreground">{feature.title}:</span>
								<span class="text-muted-foreground"> {feature.desc}</span>
							</div>
						</li>
					{/each}
				</ul>
			</div>

			<div class="relative">
				<div class="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary/20 to-blue-500/20 blur-2xl"></div>
				
				<div class="relative overflow-hidden rounded-xl border bg-card shadow-2xl">
					<div class="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
						<div class="flex gap-1.5">
							<div class="h-3 w-3 rounded-full bg-red-500/80"></div>
							<div class="h-3 w-3 rounded-full bg-amber-500/80"></div>
							<div class="h-3 w-3 rounded-full bg-emerald-500/80"></div>
						</div>
						<div class="text-xs font-medium text-muted-foreground">script.js</div>
						<div class="w-12"></div>
					</div>

					<div class="flex font-mono text-sm leading-relaxed p-4">
						<div class="mr-4 flex flex-col text-right text-muted-foreground/40 select-none">
							<span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span>
						</div>
						<div class="flex-1 overflow-x-auto">
							<div>
								<span class="text-blue-600 dark:text-blue-400">function</span>
								<span class="text-violet-700 dark:text-violet-400"> greet</span>
								<span class="text-foreground">(</span>
								<span class="text-amber-700 dark:text-amber-300">name</span>
								<span class="text-foreground">) &#123;</span>
							</div>
							<div class="pl-4">
								<span class="text-blue-600 dark:text-blue-400">const</span>
								<span class="text-foreground"> msg = </span>
								<span class="text-green-700 dark:text-emerald-400">`Hello, $&#123;</span>
								<span class="text-amber-700 dark:text-amber-300">name</span>
								<span class="text-green-700 dark:text-emerald-400">&#125;!`</span>
								<span class="text-foreground">;</span>
							</div>
							<div class="pl-4">
								<span class="text-blue-600 dark:text-blue-400">return</span>
								<span class="text-foreground"> msg;</span>
							</div>
							<div><span class="text-foreground">&#125;</span></div>
							<div class="h-4"></div>
							<div>
								<span class="text-violet-700 dark:text-violet-400">greet</span>
								<span class="text-foreground">(</span>
								<span class="text-green-700 dark:text-emerald-400">"World"</span>
								<span class="text-foreground">);</span>
								<span class="ml-1 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-primary"></span>
							</div>
						</div>
					</div>

					<div class="flex items-center gap-4 border-t bg-muted/30 px-4 py-1.5 text-[10px] text-muted-foreground">
						<div>JavaScript</div>
						<div class="ml-auto">UTF-8</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Why learn here -->
<section class="border-y bg-muted/30">
	<div class="mx-auto max-w-[1280px] px-6 py-20">
		<div class="grid gap-10 md:grid-cols-3">
			<div class="flex flex-col gap-3">
				<div class="mb-1 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
					<GiftIcon class="h-5 w-5 text-primary" />
				</div>
				<h3 class="font-display text-lg font-semibold text-foreground">{m.home_why_free_title()}</h3>
				<p class="text-sm leading-relaxed text-muted-foreground">{m.home_why_free_desc()}</p>
			</div>

			<div class="flex flex-col gap-3">
				<div class="mb-1 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
					<ZapIcon class="h-5 w-5 text-primary" />
				</div>
				<h3 class="font-display text-lg font-semibold text-foreground">{m.home_why_feedback_title()}</h3>
				<p class="text-sm leading-relaxed text-muted-foreground">{m.home_why_feedback_desc()}</p>
			</div>

			<div class="flex flex-col gap-3">
				<div class="mb-1 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
					<LayersIcon class="h-5 w-5 text-primary" />
				</div>
				<h3 class="font-display text-lg font-semibold text-foreground">{m.home_why_beginner_title()}</h3>
				<p class="text-sm leading-relaxed text-muted-foreground">{m.home_why_beginner_desc()}</p>
			</div>
		</div>
	</div>
</section>


<!-- CTA -->
<section class="mx-auto max-w-[1280px] px-6 py-28 text-center">
	<h2 class="mb-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
		{m.home_cta_title()}
	</h2>
	<p class="mx-auto mb-10 max-w-sm text-lg text-muted-foreground">
		{m.home_cta_desc()}
	</p>
	<Button href="/courses" size="lg" class="gap-2 px-10 font-display font-semibold shadow-md shadow-primary/20">
		{m.home_start_learning()}
		<ArrowRightIcon class="h-4 w-4" />
	</Button>
</section>

<style>
	.cursor-blink {
		animation: blink 1s step-end infinite;
	}
	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
	}
</style>
