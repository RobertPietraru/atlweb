<script lang="ts">
	import { ArrowUpRightIcon, LibraryBig, UsersRound } from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { BrainCircuit } from 'lucide-svelte';

	let { data } = $props();
</script>

<h1 class="mb-8 text-3xl font-bold">{m.admin_dashboard_title()}</h1>

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
			<h2 class="mb-2 text-2xl font-semibold">{m.admin_courses_title()}</h2>
			<h4 class="text-muted-foreground">{m.admin_courses_description()}</h4>
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
			<h2 class="mb-2 text-2xl font-semibold">{m.admin_exercises_title()}</h2>
			<h4 class="text-muted-foreground">{m.admin_exercises_description()}</h4>
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
			<h2 class="mb-2 text-2xl font-semibold">{m.admin_users_title()}</h2>
			<h4 class="text-muted-foreground">{m.admin_users_description()}</h4>
		</a>
	{/if}
</div>
