<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	let { data } = $props();
</script>

<main class="min-h-[100vh] w-full px-8 py-4">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Courses</h1>
		<Button href="/admin/courses/create" id="create-course-button">Creeaza curs nou</Button>
	</div>

	<div class="relative w-full overflow-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b">
					<th class="h-12 px-4 text-left align-middle font-medium">Name</th>
					<th class="h-12 px-4 text-left align-middle font-medium">Chapters</th>
					<th class="h-12 px-4 text-right align-middle font-medium">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.courses as course}
					<tr class="border-b transition-colors hover:bg-muted/50">
						<td class="p-4 align-middle">{course.name}</td>
						<td class="p-4 align-middle">{course.chapterCount}</td>
						<td class="p-4 align-middle">
							<div class="flex justify-end gap-2">
								<Button href="/admin/course/{course.id}" class="view-course-button" variant="outline" size="sm">View</Button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>
