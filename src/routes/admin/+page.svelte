<script lang="ts">
	import { ArrowUpRightIcon, LibraryBig, UsersRound } from '@lucide/svelte';
	import { BrainCircuit } from 'lucide-svelte';

	let { data } = $props();
</script>

<h1 class="mb-8 text-3xl font-bold">Panou administrativ</h1>

<div class="grid gap-6 md:grid-cols-3">
	{#if data.canViewAdminCoursesPage}
		<a
			href="/admin/courses"
			class="group flex h-full cursor-pointer flex-col overflow-hidden border-2 p-6 transition-all hover:scale-[1.02] hover:border-primary hover:shadow-lg"
		>
			<div class="flex justify-between">
				<LibraryBig class="mb-4 h-12 w-12" />
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100"
				>
					<ArrowUpRightIcon class="h-4 w-4 text-primary" />
				</div>
			</div>
			<h2 class="mb-2 text-2xl font-semibold">Cursuri</h2>
			<h4 class="text-muted-foreground">Gestionează cursurile</h4>
		</a>
	{/if}
	{#if data.canViewAdminCoursesPage}
		<a
			href="/admin/exercises"
			class="group flex h-full cursor-pointer flex-col overflow-hidden border-2 p-6 transition-all hover:scale-[1.02] hover:border-primary hover:shadow-lg"
		>
			<div class="flex justify-between">
				<BrainCircuit class="mb-4 h-12 w-12" />
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100"
				>
					<ArrowUpRightIcon class="h-4 w-4 text-primary" />
				</div>
			</div>
			<h2 class="mb-2 text-2xl font-semibold">Exerciții</h2>
			<h4 class="text-muted-foreground">Gestionează exercițiile</h4>
		</a>
	{/if}

	{#if data.canViewAdminUsersPage}
		<a
			href="/admin/users"
			class="group flex h-full cursor-pointer flex-col overflow-hidden border-2 p-6 transition-all hover:scale-[1.02] hover:border-primary hover:shadow-lg"
		>
			<div class="flex justify-between">
				<UsersRound class="mb-4 h-12 w-12" />
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100"
				>
					<ArrowUpRightIcon class="h-4 w-4 text-primary" />
				</div>
			</div>
			<h2 class="mb-2 text-2xl font-semibold">Utilizatori</h2>
			<h4 class="text-muted-foreground">Gestionează utilizatorii</h4>
		</a>
	{/if}
</div>
