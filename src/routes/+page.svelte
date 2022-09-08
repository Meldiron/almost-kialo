<script>
	import DiscussionList from '$lib/components/DiscussionList.svelte';
</script>

<div class="p-4 mb-6 text-sm text-slate-200 bg-slate-700 rounded-lg" role="alert">
	<span class="font-medium text-white">Hey there 👋</span> To learn about the project, check out our
	<a class="hover:underline font-medium text-white" href="/about">About</a> section.
</div>

<DiscussionList type="all" />
