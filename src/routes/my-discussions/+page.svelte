<script>
	import DiscussionList from '$lib/components/DiscussionList.svelte';
</script>

<section class="flex flex-col space-y-6 md:space-y-10 py-10">
	<h1
		class=" text-center text-3xl font-extrabold tracking-tight leading-none text-slate-900 md:text-4xl lg:text-5xl"
	>
		Your Discussions
	</h1>

	<p class="text-lg font-normal text-slate-500 lg:text-xl text-center">
		Handy list of all discussions that you created. Comments on discussions are considered as
		discussions too.
	</p>

	<div class="h-1 bg-slate-200 rounded-full" />
</section>

<DiscussionList type="my" />
