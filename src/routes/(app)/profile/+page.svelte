<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import {
		UserRoundIcon,
		MailIcon,
		ShieldCheckIcon,
		ClipboardListIcon,
		CheckCircle2Icon,
		ClockIcon,
		HelpCircleIcon,
		PencilIcon,
		CheckIcon,
		XIcon
	} from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { data, form } = $props();

	let editing = $state(false);
	let saving = $state(false);
	let username = $state(data.user.username);
	let email = $state(data.user.email);

	function cancelEdit() {
		username = data.user.username;
		email = data.user.email;
		editing = false;
	}

	let initials = $derived(
		data.user.username
			.split(' ')
			.map((n: string) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	);

	let isAdmin = $derived(
		data.user.permissions.includes('course.view') || data.user.permissions.length > 0
	);

	function formatDate(date: Date | string) {
		return new Date(date).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<div class="mx-auto max-w-[1280px] px-6 py-10">
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- ===== Left column ===== -->
		<div class="flex flex-col gap-6 lg:col-span-1">
			<!-- Profile card -->
			<div class="rounded-xl border bg-card p-6 shadow-sm">
				<div class="mb-5 flex flex-col items-center text-center">
					<div
						class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary font-display text-2xl font-bold text-primary-foreground shadow-md"
					>
						{initials}
					</div>
					<h1 class="font-display text-xl font-bold text-foreground">{data.user.username}</h1>
					<p class="mt-1 text-sm text-muted-foreground">{data.user.email}</p>
					<span
						class="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium
						{isAdmin
							? 'bg-primary/10 text-primary'
							: 'bg-secondary text-secondary-foreground'}"
					>
						<ShieldCheckIcon class="h-3 w-3" />
						{isAdmin ? m.admin_administrator() : m.profile_role_student()}
					</span>
				</div>

				<div class="space-y-2 border-t pt-4">
					<div class="flex items-center gap-2 text-sm text-muted-foreground">
						<UserRoundIcon class="h-4 w-4 shrink-0" />
						<span class="truncate">{data.user.username}</span>
					</div>
					<div class="flex items-center gap-2 text-sm text-muted-foreground">
						<MailIcon class="h-4 w-4 shrink-0" />
						<span class="truncate">{data.user.email}</span>
					</div>
				</div>
			</div>

			<!-- Stats cards -->
			<div class="grid grid-cols-2 gap-3">
				<div class="rounded-xl border bg-card p-4 shadow-sm">
					<div class="mb-1 flex items-center gap-2 text-muted-foreground">
						<ClipboardListIcon class="h-4 w-4" />
						<span class="font-display text-xs font-medium uppercase tracking-wide">{m.profile_stat_total()}</span>
					</div>
					<p class="font-display text-2xl font-bold text-foreground">{data.stats.total}</p>
				</div>
				<div class="rounded-xl border bg-card p-4 shadow-sm">
					<div class="mb-1 flex items-center gap-2 text-green-600 dark:text-green-400">
						<CheckCircle2Icon class="h-4 w-4" />
						<span class="font-display text-xs font-medium uppercase tracking-wide">{m.profile_stat_reviewed()}</span>
					</div>
					<p class="font-display text-2xl font-bold text-foreground">{data.stats.checked}</p>
				</div>
				<div class="rounded-xl border bg-card p-4 shadow-sm">
					<div class="mb-1 flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
						<ClockIcon class="h-4 w-4" />
						<span class="font-display text-xs font-medium uppercase tracking-wide">{m.profile_stat_pending()}</span>
					</div>
					<p class="font-display text-2xl font-bold text-foreground">{data.stats.pending}</p>
				</div>
				<div class="rounded-xl border bg-card p-4 shadow-sm">
					<div class="mb-1 flex items-center gap-2 text-blue-600 dark:text-blue-400">
						<HelpCircleIcon class="h-4 w-4" />
						<span class="font-display text-xs font-medium uppercase tracking-wide">{m.profile_stat_help()}</span>
					</div>
					<p class="font-display text-2xl font-bold text-foreground">{data.stats.needHelp}</p>
				</div>
			</div>

			<!-- Edit profile card -->
			<div class="rounded-xl border bg-card shadow-sm">
				<div class="flex items-center justify-between border-b px-6 py-4">
					<h2 class="font-display text-base font-semibold text-foreground">{m.profile_edit_title()}</h2>
					{#if !editing}
						<Button variant="ghost" size="icon" onclick={() => (editing = true)} class="h-8 w-8">
							<PencilIcon class="h-4 w-4" />
							<span class="sr-only">{m.profile_edit_title()}</span>
						</Button>
					{/if}
				</div>

				<div class="p-6">
					{#if form?.error}
						<div class="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
							{form.error}
						</div>
					{/if}
					{#if form?.success}
						<div class="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
							{m.profile_update_success()}
						</div>
					{/if}

					<form
						method="POST"
						action="?/updateProfile"
						use:enhance={() => {
							saving = true;
							return async ({ result, update }) => {
								saving = false;
								await update();
								if (result.type === 'success') {
									editing = false;
									data.user.username = username;
									data.user.email = email;
								}
							};
						}}
						class="space-y-4"
					>
						<div class="space-y-1.5">
							<Label for="username" class="font-display font-medium">{m.admin_user_username()}</Label>
							<Input
								id="username"
								name="username"
								type="text"
								bind:value={username}
								disabled={!editing}
								class="h-10 {!editing ? 'cursor-default opacity-70' : ''}"
								required
							/>
						</div>
						<div class="space-y-1.5">
							<Label for="email" class="font-display font-medium">{m.auth_email_label()}</Label>
							<Input
								id="email"
								name="email"
								type="email"
								bind:value={email}
								disabled={!editing}
								class="h-10 {!editing ? 'cursor-default opacity-70' : ''}"
								required
							/>
						</div>

						{#if editing}
							<div class="flex gap-2 pt-1">
								<Button
									type="submit"
									size="sm"
									class="flex-1 gap-1.5 font-display font-semibold"
									disabled={saving}
								>
									<CheckIcon class="h-4 w-4" />
									{saving ? m.profile_saving() : m.profile_save_changes()}
								</Button>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onclick={cancelEdit}
									disabled={saving}
									class="gap-1.5"
								>
									<XIcon class="h-4 w-4" />
									{m.profile_cancel()}
								</Button>
							</div>
						{/if}
					</form>
				</div>
			</div>
		</div>

		<!-- ===== Right column — submission history ===== -->
		<div class="lg:col-span-2">
			<div class="rounded-xl border bg-card shadow-sm">
				<div class="border-b px-6 py-4">
					<h2 class="font-display text-base font-semibold text-foreground">{m.profile_submissions_title()}</h2>
					<p class="mt-0.5 text-sm text-muted-foreground">
						{m.profile_submissions_description()}
					</p>
				</div>

				{#if data.submissions.length === 0}
					<div class="flex flex-col items-center justify-center gap-3 py-16 text-center">
						<div class="rounded-full bg-muted p-4">
							<ClipboardListIcon class="h-8 w-8 text-muted-foreground/50" />
						</div>
						<p class="font-display font-medium text-muted-foreground">{m.profile_no_submissions()}</p>
						<p class="max-w-xs text-sm text-muted-foreground">
							{m.profile_no_submissions_hint()}
						</p>
						<Button href="/exercises" variant="outline" size="sm" class="mt-2 font-display font-medium">
							{m.profile_browse_exercises()}
						</Button>
					</div>
				{:else}
					<div class="divide-y">
						{#each data.submissions as submission}
							<div class="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/30">
								<div class="min-w-0 flex-1">
									<a
										href="/exercises/{submission.exerciseId}"
										class="block truncate font-display text-sm font-semibold text-foreground transition-colors hover:text-primary"
									>
										{submission.exerciseTitle}
									</a>
									<p class="mt-0.5 text-xs text-muted-foreground">
										{formatDate(submission.submissionDate)}
									</p>
								</div>

								<div class="flex shrink-0 items-center gap-2">
									{#if submission.needHelp}
										<span
											class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
										>
											<HelpCircleIcon class="h-3 w-3" />
											{m.profile_stat_help()}
										</span>
									{/if}

									{#if submission.checked}
										<span
											class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
										>
											<CheckCircle2Icon class="h-3 w-3" />
											{m.profile_stat_reviewed()}
										</span>
									{:else}
										<span
											class="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
										>
											<ClockIcon class="h-3 w-3" />
											{m.profile_stat_pending()}
										</span>
									{/if}
								</div>
							</div>
						{/each}
					</div>

					<!-- Pagination -->
					{#if data.totalPages > 1}
						<div class="flex items-center justify-between border-t px-6 py-4">
							<p class="text-sm text-muted-foreground">
								{m.profile_page_of({ nr1: data.page, nr2: data.totalPages })}
							</p>
							<div class="flex items-center gap-2">
								<Button
									href="?page={data.page - 1}"
									variant="outline"
									size="sm"
									class="font-display font-medium {data.page <= 1 ? 'pointer-events-none opacity-40' : ''}"
								>
									{m.profile_previous()}
								</Button>
								<Button
									href="?page={data.page + 1}"
									variant="outline"
									size="sm"
									class="font-display font-medium {data.page >= data.totalPages ? 'pointer-events-none opacity-40' : ''}"
								>
									{m.profile_next()}
								</Button>
							</div>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>
