<script lang="ts">
	import { goto } from '$app/navigation';

	import { accountStore } from '$lib/accountStore';
	import { AppwriteService } from '$lib/appwrite';

	declare const moment: any;

	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	let discussion: null | any = null;
	let profile: null | any = null;

	let isDetailOpened = false;
	let showDeleteModal = false;

	onMount(async () => {
		discussion = await AppwriteService.getDiscussion(data.discussionId);
		profile = await AppwriteService.getProfile(discussion.userId);
	});

	async function deleteDiscussion() {
		await AppwriteService.deleteDiscussion(discussion.$id);
		goto('/');
	}
</script>

{#if discussion && profile}
	<div class="p-6 bg-white rounded-lg border border-slate-200 shadow-md">
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-slate-900">
			{discussion.title}
		</h5>

		<p class="mb-3 font-normal text-slate-700">
			{discussion.description}
		</p>

		<div class="inline-flex items-center">
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

	<div
		class={`${
			isDetailOpened ? '' : 'max-h-[75px]  overflow-y-hidden relative'
		} mt-4 p-6 bg-white rounded-lg border border-slate-200 shadow-md`}
	>
		{#if !isDetailOpened}
			<div
				class="font-medium flex items-center justify-center absolute bottom-0 left-0 w-full bg-gradient-to-b from-transparent to-white  h-[75px]"
			>
				<button on:click={() => (isDetailOpened = !isDetailOpened)} class="hover:underline"
					>Show Details</button
				>
			</div>
		{/if}

		<div class="flex flex-col space-y-4">
			<div>
				<p class="mb-1 text-sm text-slate-400">Discussion started by:</p>
				<div class="flex justify-start">
					<section class="flex justify-center items-center space-x-3">
						<img
							class="w-10 h-10 rounded-full"
							src={AppwriteService.getProfilePicture(profile.nickname)}
							alt="profile"
						/>
						<div class="font-medium text-left">
							<div>{profile.nickname}</div>
							<div class="text-sm font-light text-slate-700">
								Member since {moment(profile.$createdAt).format('MMM Do YYYY')}
							</div>
						</div>
					</section>
				</div>
			</div>

			<div>
				<p class="mb-1 text-sm text-slate-400">Discussion started:</p>

				<p>{moment(discussion.$createdAt).calendar()}</p>
			</div>

			<div>
				<p class="mb-1 text-sm text-slate-400">Language:</p>

				<p>{AppwriteService.getLanguageFromCode(discussion.languageCode)}</p>
			</div>

			<div>
				<p class="mb-1 text-sm text-slate-400">Visibility:</p>

				<p>{discussion.isPrivate ? 'Private' : 'Public'}</p>
			</div>

			<div>
				<p class="mb-1 text-sm text-slate-400">Tags:</p>
				<div style="line-height: 40px;">
					{#each discussion.tags as tag}
						<a
							href={`/tags/${tag}`}
							class="inline px-2 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-200 bg-slate-100 border border-slate-200 rounded-lg mr-2"
							><span class="text-slate-400">#</span> {tag}</a
						>
					{/each}
				</div>
			</div>

			<hr />

			<div class="font-medium flex justify-center">
				<button on:click={() => (isDetailOpened = !isDetailOpened)} class="hover:underline"
					>Hide Details</button
				>
			</div>
		</div>
	</div>

	{#if profile.$id === $accountStore?.$id || $accountStore?.prefs?.isMod}
		<div class="mt-4 p-6 bg-white rounded-lg border border-slate-200 shadow-md">
			<p class="mb-3 text-sm text-slate-400">Administrative actions:</p>

			<button
				on:click={() => (showDeleteModal = !showDeleteModal)}
				type="button"
				class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 "
				>Delete Discussion</button
			>
		</div>
	{/if}
{/if}

{#if showDeleteModal}
	<div
		tabindex="-1"
		class=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full justify-center items-center bg-black bg-opacity-50"
	>
		<div class="mx-auto relative p-4 w-full max-w-md h-full md:h-auto">
			<div class="relative bg-white rounded-lg shadow">
				<button
					on:click={() => (showDeleteModal = !showDeleteModal)}
					type="button"
					class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
					data-modal-toggle="popup-modal"
				>
					<svg
						aria-hidden="true"
						class="w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/></svg
					>
					<span class="sr-only">Close modal</span>
				</button>
				<div class="p-6 text-center">
					<svg
						aria-hidden="true"
						class="mx-auto mb-4 w-14 h-14 text-gray-400 "
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<h3 class="mb-5 text-lg font-normal text-gray-500 ">
						Are you sure you want to delete this discussion?
					</h3>
					<button
						on:click={deleteDiscussion}
						data-modal-toggle="popup-modal"
						type="button"
						class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
					>
						Yes, I'm sure
					</button>
					<button
						on:click={() => (showDeleteModal = !showDeleteModal)}
						data-modal-toggle="popup-modal"
						type="button"
						class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 "
						>No, cancel</button
					>
				</div>
			</div>
		</div>
	</div>
{/if}
