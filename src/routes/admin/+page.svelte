<script lang="ts">
	import { ArrowUpRightIcon, LibraryBig, UsersRound, BrainCircuit } from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { data } = $props();
</script>

<h1 class="mb-8 font-display text-3xl font-bold tracking-tight">{m.admin_dashboard_title()}</h1>

<div class="grid gap-6 md:grid-cols-3">
	{#if data.canViewAdminCoursesPage}
		<a
			href="/admin/courses"
			class="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border-2 bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
		>
			<div class="mb-4 flex items-start justify-between">
				<div class="rounded-xl bg-primary/10 p-3">
					<LibraryBig class="h-6 w-6 text-primary" />
				</div>
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100">
					<ArrowUpRightIcon class="h-4 w-4 text-primary" />
				</div>
			</div>
			<h2 class="mb-1 font-display text-xl font-semibold">{m.admin_courses_title()}</h2>
			<p class="text-sm text-muted-foreground">{m.admin_courses_description()}</p>
		</a>
	{/if}

	{#if data.canViewAdminCoursesPage}
		<a
			href="/admin/exercises"
			class="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border-2 bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
		>
			<div class="mb-4 flex items-start justify-between">
				<div class="rounded-xl bg-primary/10 p-3">
					<BrainCircuit class="h-6 w-6 text-primary" />
				</div>
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100">
					<ArrowUpRightIcon class="h-4 w-4 text-primary" />
				</div>
			</div>
			<h2 class="mb-1 font-display text-xl font-semibold">{m.admin_exercises_title()}</h2>
			<p class="text-sm text-muted-foreground">{m.admin_exercises_description()}</p>
		</a>
	{/if}

	{#if data.canViewAdminUsersPage}
		<a
			href="/admin/users"
			class="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border-2 bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
		>
			<div class="mb-4 flex items-start justify-between">
				<div class="rounded-xl bg-primary/10 p-3">
					<UsersRound class="h-6 w-6 text-primary" />
				</div>
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100">
					<ArrowUpRightIcon class="h-4 w-4 text-primary" />
				</div>
			</div>
			<h2 class="mb-1 font-display text-xl font-semibold">{m.admin_users_title()}</h2>
			<p class="text-sm text-muted-foreground">{m.admin_users_description()}</p>
		</a>
	{/if}
</div>
