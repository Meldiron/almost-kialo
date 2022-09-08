<script lang="ts">
	import { goto } from '$app/navigation';
	import { accountStore } from '$lib/accountStore';
	import { AppwriteService } from '$lib/appwrite';
	import { onMount } from 'svelte';

	let nickname = '';

	onMount(() => {
		nickname = $accountStore.prefs.profile.nickname ?? '';
	});

	async function onSubmit() {
		if (await AppwriteService.setProfile(nickname)) {
			goto('/');
		}
	}
</script>

<section class="flex flex-col space-y-6 md:space-y-10 py-10">
	<h1
		class=" text-center text-3xl font-extrabold tracking-tight leading-none text-slate-900 md:text-4xl lg:text-5xl"
	>
		Modify Your Profile
	</h1>

	<p class="text-lg font-normal text-slate-500 lg:text-xl text-center">
		We all need a small change from time to time.
	</p>

	<div class="h-1 bg-slate-200 rounded-full" />

	<form on:submit|preventDefault={onSubmit}>
		<label for="nickname" class="block mb-2 font-medium text-slate-900">Nickname:</label>
		<input
			bind:value={nickname}
			type="text"
			required={true}
			maxlength={255}
			id="nickname"
			class="block p-4 w-full text-slate-900 bg-slate-50 rounded-lg border border-slate-300 sm:text-md focus:ring-blue-500 focus:border-blue-500 "
		/>
		<button
			type="submit"
			class="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg w-full sm:w-auto px-10 py-4 text-center"
			>Update Profile</button
		>
	</form>
</section>
