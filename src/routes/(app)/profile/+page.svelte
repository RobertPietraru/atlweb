<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Pagination from '$lib/components/ui/pagination/index.js';

	let { data } = $props();
	let submissions = $state(data.user);
</script>

<div class="container py-8">
	<h1 class="mb-8 text-3xl font-bold">Soluții Trimise</h1>

	<Card>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Exercițiu</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head>Trimis</Table.Head>
					<Table.Head>Ajutor</Table.Head>
					<Table.Head>Anonim</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each submissions as submission}
					<Table.Row class="p-8">
						<Table.Cell><a href={submission.exercisePage} class="text-primary underline">{submission.exerciseName}</a></Table.Cell>
						<Table.Cell>
							{#if submission.checked}
								<span class="text-green-600">Verificat</span>
							{:else}
								<span class="text-yellow-600">În așteptare</span>
							{/if}
						</Table.Cell>
						<Table.Cell>{new Date(submission.submissionDate).toLocaleDateString()}</Table.Cell>
						<Table.Cell>{submission.needHelp ? 'Da' : 'Nu'}</Table.Cell>
						<Table.Cell>{submission.anonymous ? 'Da' : 'Nu'}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card>
</div>

<Pagination.Root count={data.total} perPage={data.limit}>
	{#snippet children({ pages, currentPage })}
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton />
			</Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link {page} isActive={currentPage === page.value}>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.NextButton />
			</Pagination.Item>
		</Pagination.Content>
	{/snippet}
</Pagination.Root>
