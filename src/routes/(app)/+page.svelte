<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { BookOpenIcon, BrainCircuitIcon, UsersIcon, ArrowRightIcon } from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages.js';
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
				<span class="bg-gradient-to-r from-primary via-blue-500 to-blue-400 bg-clip-text text-transparent">
					{m.home_title()}
				</span>
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

<!-- Features -->
<section class="mx-auto max-w-[1280px] px-6 pb-24">
	<div class="grid gap-6 md:grid-cols-3">
		<!-- Card 1 -->
		<div class="group rounded-xl border bg-card p-8 shadow-sm transition-all duration-200 hover:border-primary hover:shadow-md">
			<div class="mb-5 inline-flex rounded-xl bg-primary/10 p-3">
				<BookOpenIcon class="h-6 w-6 text-primary" />
			</div>
			<h3 class="mb-2 font-display text-lg font-semibold text-foreground">
				{m.home_interactive_courses_title()}
			</h3>
			<p class="text-sm leading-relaxed text-muted-foreground">
				{m.home_interactive_courses_description()}
			</p>
		</div>

		<!-- Card 2 -->
		<div class="group rounded-xl border bg-card p-8 shadow-sm transition-all duration-200 hover:border-primary hover:shadow-md">
			<div class="mb-5 inline-flex rounded-xl bg-primary/10 p-3">
				<BrainCircuitIcon class="h-6 w-6 text-primary" />
			</div>
			<h3 class="mb-2 font-display text-lg font-semibold text-foreground">
				{m.home_practical_exercises_title()}
			</h3>
			<p class="text-sm leading-relaxed text-muted-foreground">
				{m.home_practical_exercises_description()}
			</p>
		</div>

		<!-- Card 3 -->
		<div class="group rounded-xl border bg-card p-8 shadow-sm transition-all duration-200 hover:border-primary hover:shadow-md">
			<div class="mb-5 inline-flex rounded-xl bg-primary/10 p-3">
				<UsersIcon class="h-6 w-6 text-primary" />
			</div>
			<h3 class="mb-2 font-display text-lg font-semibold text-foreground">
				{m.home_community_title()}
			</h3>
			<p class="text-sm leading-relaxed text-muted-foreground">
				{m.home_community_description()}
			</p>
		</div>
	</div>
</section>

<!-- CTA banner -->
<section class="border-t bg-primary/5">
	<div class="mx-auto max-w-[1280px] px-6 py-20 text-center">
		<h2 class="mb-4 font-display text-3xl font-bold text-foreground">
			{m.home_start_learning()}
		</h2>
		<p class="mx-auto mb-8 max-w-md text-muted-foreground">
			{m.home_subtitle()}
		</p>
		<Button href="/courses" size="lg" class="gap-2 px-10 font-display font-semibold shadow-md shadow-primary/20">
			{m.home_start_learning()}
			<ArrowRightIcon class="h-4 w-4" />
		</Button>
	</div>
</section>
