<script lang="ts">
	import { accountStore } from '$lib/accountStore';

	import { AppwriteService } from '$lib/appwrite';
	import { Query } from 'appwrite';
	import { onMount } from 'svelte';

	export let type: 'my' | 'all' | 'lang' | 'tag' = 'all';
	export let typeData: string = '';

	let cursor: null | string = null;
	let hasNextPage = true;

	let discussions: any[] = [];

	onMount(async () => {
		await loadPage();
	});

	async function loadNextPage() {
		cursor = discussions[discussions.length - 1].$id;
		await loadPage();
	}

	async function loadPage() {
		const limit = 10;
		const queries = [Query.limit(limit + 1)];

		if (type === 'my') {
			queries.push(Query.equal('userId', $accountStore?.$id ?? ''));
		}

		if (type === 'lang') {
			queries.push(Query.equal('languageCode', typeData ?? ''));
		}

		if (type === 'tag') {
			queries.push(Query.search('tagsSearch', typeData ?? ''));
		}

		if (cursor) {
			queries.push(Query.cursorAfter(cursor));
		}

		queries.push(Query.orderDesc('$createdAt'));

		const page = await AppwriteService.getDiscussions(queries);

		if (page.documents.length > limit) {
			hasNextPage = true;
			page.documents.pop();
		} else {
			hasNextPage = false;
		}

		discussions.push(...page.documents);
		discussions = discussions;
	}
</script>

<div class="flex flex-col space-y-6">
	{#each discussions as discussion}
		<div id={discussion.$id} class="p-6 bg-white rounded-lg border border-slate-200 shadow-md">
			<!--
    <figcaption class="flex justify-center items-center space-x-3">
        <img
            class="w-9 h-9 rounded-full"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
            alt="profile picture"
        />
        <div class="space-y-0.5 font-medium  text-left">
            <div>Jese Leos</div>
            <div class="text-sm font-light text-slate-500 ">Software Engineer at Facebook</div>
        </div>
    </figcaption>
    -->

			<div class="pb-4" style="line-height: 40px;">
				<a
					href={`/langs/${discussion.languageCode}`}
					class="inline px-2 py-1.5 text-xs font-semibold bg-slate-700 hover:bg-slate-800 text-slate-100 border border-slate-900 rounded-lg mr-2"
					>{AppwriteService.getLanguageFromCode(discussion.languageCode)}</a
				>
				{#each discussion.tags as tag}
					<a
						href={`/tags/${tag}`}
						class="inline px-2 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-200 bg-slate-100 border border-slate-200 rounded-lg mr-2"
						><span class="text-slate-400">#</span> {tag}</a
					>
				{/each}
			</div>

			<a href={`/discussions/${discussion.$id}`}>
				<h5 class="mb-2 text-2xl font-bold tracking-tight text-slate-900 line-clamp-1">
					{discussion.title}
				</h5>
			</a>
			<p class="mb-3 font-normal text-slate-700 line-clamp-2">
				{discussion.description}
			</p>
			<div style="line-height: 40px;">
				<a
					href={`/discussions/${discussion.$id}`}
					class="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
				>
					Show Discussion
					<svg
						aria-hidden="true"
						class="ml-2 -mr-1 w-4 h-4"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/></svg
					>
				</a>

				<div class="inline-flex items-center ml-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="3"
						stroke="currentColor"
						class="w-4 h-4 text-green-500"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
						/>
					</svg>

					<p class="text-sm font-bold text-slate-900 ">{discussion.totalPositive}</p>
					<span class="mx-2 w-1 h-1 bg-slate-500 rounded-full " />
					<p class="text-sm font-bold text-slate-900 ">{discussion.totalNegative}</p>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="3"
						stroke="currentColor"
						class="w-4 h-4 text-red-500 transform rotate-180"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
						/>
					</svg>
				</div>
			</div>
		</div>
	{/each}
</div>

<div class="flex justify-center mt-4">
	{#if hasNextPage}
		<button
			on:click={loadNextPage}
			type="button"
			class="text-blue-700 border border-blue-700 hover:bg-blue-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-2.5 text-center mr-2 mb-2"
			>Load More</button
		>
	{:else}
		<button
			type="button"
			disabled
			class="text-blue-700 border border-transparent   font-medium rounded-lg text-sm px-10 py-2.5 text-center mr-2 mb-2"
			>You reached the end.</button
		>
	{/if}
</div>
