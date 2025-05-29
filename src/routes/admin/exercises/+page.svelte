<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
	import { ArrowUpRightIcon, BookOpenIcon, SearchIcon } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';

	let { data } = $props();
	
	let searchQuery = $state('');
	
	let filteredExercises = $derived(data.exercises.filter(exercise => 
		exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		exercise.summary.toLowerCase().includes(searchQuery.toLowerCase())
	));

</script>

<main class="min-h-[100vh] w-full py-4">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-2xl font-bold md:text-3xl">Exercitii</h1>
		<Button href="/admin/exercises/create" id="create-exercise-button">Creeaza exercitiu nou</Button>
	</div>

	<div class="mb-6 flex w-full max-w-sm items-center space-x-2">
		<SearchIcon class="h-5 w-5 text-muted-foreground" />
		<Input 
			type="text"
			placeholder="Cauta exercitii..."
			bind:value={searchQuery}
			class="w-full"
		/>
	</div>

	<div class="space-y-4">
		{#each filteredExercises as exercise}
			<a href="/admin/exercises/{exercise.id}" class="block">
				<Card
					class="group cursor-pointer border-2 transition-all hover:scale-[1.01] hover:border-primary hover:shadow-md"
				>
					<CardContent class="p-4">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div class="rounded-full bg-primary/10 p-2">
									<BookOpenIcon class="h-5 w-5 text-primary" />
								</div>
								<div>
									<h2 class="text-xl font-semibold group-hover:text-primary">
										{exercise.title}
									</h2>
									<p class="text-sm text-muted-foreground">{exercise.summary}</p>
								</div>
							</div>
							<div class="flex items-center gap-2">
								<Button variant="outline" class="group-hover:bg-primary group-hover:text-primary-foreground">
									Editeaza
									<ArrowUpRightIcon class="ml-2 h-4 w-4" />
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</a>
		{/each}

		{#if filteredExercises.length === 0}
			<div class="flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
				<p class="text-muted-foreground">Nu s-au gasit exercitii care sa corespunda cautarii</p>
			</div>
		{/if}
	</div>
</main>