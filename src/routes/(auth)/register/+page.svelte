<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { register } from './register.remote';
	import * as m from '$lib/paraglide/messages.js';
	import { BookOpenIcon, Loader2Icon } from '@lucide/svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();

	let submitting = $state(false);
</script>

<div class="flex min-h-screen">
	<!-- Left brand panel -->
	<div
		class="hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex lg:w-5/12"
	>
		<a href="/" class="font-display text-2xl font-bold">{m.brand_name()}</a>

		<div>
			<div class="mb-6 inline-flex rounded-2xl bg-white/10 p-4">
				<BookOpenIcon class="h-8 w-8" />
			</div>
			<blockquote class="space-y-3">
				<p class="font-display text-3xl font-semibold leading-snug">
					{m.home_title()}
				</p>
				<p class="text-base leading-relaxed text-primary-foreground/75">
					{m.home_subtitle()}
				</p>
			</blockquote>
		</div>

		<p class="text-sm text-primary-foreground/60">{m.footer_copyright()}</p>
	</div>

	<!-- Right form panel -->
	<div class="flex flex-1 flex-col">
		<!-- Mobile brand header -->
		<div class="flex items-center justify-between border-b px-8 py-5 lg:hidden">
			<a href="/" class="font-display text-xl font-bold text-primary">{m.brand_name()}</a>
		</div>

		<div class="flex flex-1 items-center justify-center px-8 py-12">
			<div class="w-full max-w-sm">
				<div class="mb-8">
					<h1 class="font-display text-3xl font-bold text-foreground">
						{m.auth_register_title()}
					</h1>
					<p class="mt-2 text-sm text-muted-foreground">
						{m.auth_has_account()}
						<a href="/login" class="font-medium text-primary hover:underline"
							>{m.auth_login_link()}</a
						>
					</p>
				</div>

				<form
					{...register}
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => {
							await update();
							submitting = false;
						};
					}}
					class="space-y-5"
				>
					<input type="hidden" name="redirectUrl" value={data.redirectUrl} />

					<div class="space-y-1.5">
						<Label for="username" class="font-display font-medium"
							>{m.auth_username_label()}</Label
						>
						<Input
							id="username"
							{...register.fields.username.as('text')}
							autocomplete="username"
							required
							disabled={submitting}
							class="h-11"
						/>
						{#each register.fields.username.issues() as issue}
							<p class="text-xs text-destructive">{issue.message}</p>
						{/each}
					</div>

					<div class="space-y-1.5">
						<Label for="email" class="font-display font-medium">{m.auth_email_label()}</Label>
						<Input
							id="email"
							{...register.fields.email.as('email')}
							autocomplete="email"
							required
							disabled={submitting}
							class="h-11"
						/>
						{#each register.fields.email.issues() as issue}
							<p class="text-xs text-destructive">{issue.message}</p>
						{/each}
					</div>

					<div class="space-y-1.5">
						<Label for="_password" class="font-display font-medium"
							>{m.auth_password_label()}</Label
						>
						<Input
							id="_password"
							{...register.fields._password.as('password')}
							autocomplete="new-password"
							required
							disabled={submitting}
							class="h-11"
						/>
						{#each register.fields._password.issues() as issue}
							<p class="text-xs text-destructive">{issue.message}</p>
						{/each}
					</div>

					<Button
						type="submit"
						disabled={submitting}
						class="h-11 w-full gap-2 font-display font-semibold shadow-md shadow-primary/20"
					>
						{#if submitting}
							<Loader2Icon class="h-4 w-4 animate-spin" />
						{/if}
						{submitting ? m.auth_register_loading() : m.auth_register_button()}
					</Button>
				</form>
			</div>
		</div>
	</div>
</div>
