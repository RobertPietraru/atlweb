<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { ArrowRightIcon, BookOpenIcon, CodeIcon, UsersIcon, Github } from 'lucide-svelte';
	import { mode } from 'mode-watcher';
	let gradient = $derived(
		$mode === 'dark'
			? 'from-[#a22604] via-[#e34211] to-[#fb5b27]'
			: 'from-[#2563eb] via-[#3b82f6] to-[#60a5fa]'
	);
</script>

<section class="container grid gap-10 py-20 md:py-32">
	<div class="space-y-6 text-center">
		<main class="text-center text-5xl font-bold md:text-6xl">
			<h1 class="font-bold">
				ATLWEB - <span class="bg-gradient-to-r {gradient} bg-clip-text text-transparent"
					>Învață programare web</span
				>
			</h1>
		</main>
		<h2 class="mx-auto text-center text-2xl text-muted-foreground md:w-10/12">
			Platformă educațională pentru învățarea programării web într-un mod interactiv și practic
		</h2>
		<div class="flex justify-center gap-4">
			<Button href="/courses" size="lg" class="px-8" id="main-button">
				Începe să înveți
				<ArrowRightIcon class="ml-2 h-4 w-4" />
			</Button>

			<Button
				href="https://github.com/RobertPietraru/atlweb"
				id="github-button"
				variant="outline"
				size="lg"
				class="px-8"
			>
				Repository Github
				<svg
					width="15"
					height="15"
					viewBox="0 0 15 15"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="ml-2 h-5 w-5"
					><path
						d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
						fill="currentColor"
						fill-rule="evenodd"
						clip-rule="evenodd"
					></path></svg
				>
			</Button>
		</div>
	</div>

	<div class="grid gap-16 py-16 md:grid-cols-3">
		<Card.Root class="flex flex-col items-center text-center">
			<Card.Header>
				<div class="mx-auto rounded-full bg-primary/10 p-4">
					<BookOpenIcon class="h-8 w-8 text-primary" />
				</div>
				<Card.Title>Cursuri Interactive</Card.Title>
			</Card.Header>
			<Card.Content>
				<Card.Description
					>Învață prin cursuri structurate cu exemple practice și exerciții interactive</Card.Description
				>
			</Card.Content>
		</Card.Root>

		<Card.Root class="flex flex-col items-center text-center">
			<Card.Header>
				<div class="mx-auto rounded-full bg-primary/10 p-4">
					<BookOpenIcon class="h-8 w-8 text-primary" />
				</div>
				<Card.Title>Exerciții Practice</Card.Title>
			</Card.Header>
			<Card.Content>
				<Card.Description
					>Rezolvă exerciții și primește feedback instant pentru a-ți îmbunătăți abilitățile</Card.Description
				>
			</Card.Content>
		</Card.Root>

		<Card.Root class="flex flex-col items-center text-center">
			<Card.Header>
				<div class="mx-auto rounded-full bg-primary/10 p-4">
					<UsersIcon class="h-8 w-8 text-primary" />
				</div>
				<Card.Title>Comunitate</Card.Title>
			</Card.Header>
			<Card.Content>
				<Card.Description
					>Conectează-te cu alți cursanți și împărtășește experiența ta de învățare</Card.Description
				>
			</Card.Content>
		</Card.Root>
	</div>
</section>

{#if $mode === 'dark'}
	<img
		src="/laurian.png"
		alt="Colegiul Naţional „A. T. Laurian” Botoşani"
		class="fixed bottom-0 right-0 -z-10 object-cover opacity-20 dark:opacity-10 dark:md:opacity-50"
		style="height: calc(100vh - 4rem);"
	/>
{:else}
	<img
		src="/laurian_light.png"
		alt="Colegiul Naţional „A. T. Laurian” Botoşani"
		class="fixed bottom-0 right-0 -z-50 object-cover"
		style="height: calc(100vh - 4rem);"
	/>
{/if}
