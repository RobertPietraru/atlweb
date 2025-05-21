<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	let { data } = $props();
</script>

<div class="container mx-auto p-8">
	<h1 class="mb-8 text-3xl font-bold">Dashboard administrativ</h1>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#if data.permissions?.includes('user.view')}
			<Card>
				<CardHeader>
					<CardTitle>Utilizatori</CardTitle>
				</CardHeader>
				<CardContent>
					<a href="/admin/users" class="text-blue-500 hover:underline">Gestionează utilizatorii</a>
				</CardContent>
			</Card>
		{/if}

		{#if data.permissions?.includes('course.view')}
			<Card>
				<CardHeader>
					<CardTitle>Cursuri</CardTitle>
				</CardHeader>
				<CardContent>
					<a href="/admin/courses" class="text-blue-500 hover:underline">Gestionează cursurile</a>
				</CardContent>
			</Card>
		{/if}
	</div>
</div>
