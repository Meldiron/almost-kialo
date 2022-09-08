<script>
	import { AppwriteService } from '$lib/appwrite';
	import DiscussionList from '$lib/components/DiscussionList.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<section class="flex flex-col space-y-6 md:space-y-10 py-10">
	<h1
		class=" text-center text-3xl font-extrabold tracking-tight leading-none text-slate-900 md:text-4xl lg:text-5xl"
	>
		{AppwriteService.getLanguageFromCode(data.langId ?? '')} Discussions
	</h1>

	<p class="text-lg font-normal text-slate-500 lg:text-xl text-center">
		List of all discussions in {AppwriteService.getLanguageFromCode(data.langId ?? '')} language
	</p>

	<div class="h-1 bg-slate-200 rounded-full" />
</section>

<DiscussionList type="lang" typeData={data.langId ?? ''} />
