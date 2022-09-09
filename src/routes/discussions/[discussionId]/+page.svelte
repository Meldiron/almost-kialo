<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { accountStore } from '$lib/accountStore';
	import { AppwriteService } from '$lib/appwrite';
	import DiscussionList from '$lib/components/DiscussionList.svelte';

	// @ts-ignore
	declare const moment: any;

	let discussion: null | any = null;
	let profile: null | any = null;

	let isDetailOpened = false;
	let showDeleteModal = false;

	async function loadDiscussion() {
		discussion = null;
		profile = null;
		isDetailOpened = false;
		showDeleteModal = false;

		discussion = await AppwriteService.getDiscussion($page.params.discussionId);
		profile = await AppwriteService.getProfile(discussion.userId);
	}

	$: $page.params.discussionId, loadDiscussion();

	async function deleteDiscussion() {
		const res = await AppwriteService.deleteDiscussion(discussion.$id);
		showDeleteModal = false;
		if (res) {
			goto('/');
		}
	}

	let commentDescription = '';
	let commentIsNegative: any = undefined;

	async function submitComment() {
		const comment = await AppwriteService.createDiscussion(
			'',
			commentDescription,
			discussion.$id,
			discussion.languageCode,
			commentIsNegative,
			discussion.tags
		);

		if (comment) {
			commentDescription = '';
			commentIsNegative = undefined;

			goto('/discussions/' + comment.$id);
		}
	}
</script>

{#if discussion && profile}
	{#if discussion.parentId !== '_noParent'}
		<div
			id="alert-additional-content-1"
			class="p-4 mb-4 border border-blue-300 rounded-lg bg-blue-50 "
			role="alert"
		>
			<div class="flex items-center">
				<svg
					aria-hidden="true"
					class="w-5 h-5 mr-2 text-blue-900"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
						clip-rule="evenodd"
					/></svg
				>
				<span class="sr-only">Info</span>
				<h3 class="text-lg font-medium text-blue-900">This answers previous discussion!</h3>
			</div>
			<div class="flex mt-2 ">
				<a
					href={`/discussions/${discussion.parentId}`}
					class="text-blue-900 bg-transparent border border-blue-900 hover:bg-blue-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 text-center "
					data-dismiss-target="#alert-additional-content-1"
					aria-label="Close"
				>
					View parent discussion
				</a>
			</div>
		</div>
	{/if}
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
				<p class="mb-1 text-sm text-slate-400">Author:</p>
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
				<p class="mb-1 text-sm text-slate-400">Written:</p>

				<p>{moment(discussion.$createdAt).calendar()}</p>
			</div>

			<div>
				<p class="mb-1 text-sm text-slate-400">Language:</p>

				<p>{AppwriteService.getLanguageFromCode(discussion.languageCode)}</p>
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

	<hr class="my-6" />

	<form
		on:submit|preventDefault={submitComment}
		class="p-6 bg-white rounded-lg border border-slate-200 shadow-md"
	>
		<h5 class="mb-4 text-2xl font-bold tracking-tight text-slate-900">Comment on Discussion:</h5>

		{#if $accountStore}
			<div
				class="flex mb-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 "
			>
				<div class="w-full rounded-l-lg border-r border-gray-200">
					<div class="flex items-center pl-5">
						<input
							bind:group={commentIsNegative}
							value={false}
							id="agree-yes"
							type="radio"
							required={true}
							name="agree"
							class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
						/>
						<label for="agree-yes" class="py-3 ml-2 w-full text-sm font-medium text-gray-900"
							>I agree
						</label>
					</div>
				</div>
				<div class="w-full rounded-r-lg border-gray-200">
					<div class="flex items-center pl-5">
						<input
							bind:group={commentIsNegative}
							value={true}
							id="agree-no"
							type="radio"
							required={true}
							name="agree"
							class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
						/>
						<label for="agree-no" class="py-3 ml-2 w-full text-sm font-medium text-gray-900 "
							>I disagree</label
						>
					</div>
				</div>
			</div>

			<textarea
				bind:value={commentDescription}
				id="comment-description"
				maxlength="1024"
				required={true}
				rows="4"
				class="block p-2.5 w-full text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 "
				placeholder="Your take on the topic ..."
			/>

			<div class="flex justify-end mt-3">
				<button
					type="submit"
					class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0"
					>Submit Comment</button
				>
			</div>
		{:else}
			<p class="mb-3 text-sm text-orange-500">Please login to write a comment.</p>
		{/if}
	</form>

	<div class="mt-4 grid grid-cols-6 md:grid-cols-12 gap-4">
		<div class="col-span-6">
			<div
				class="p-6 text-center flex items-center justify-center space-x-2 font-medium bg-green-100 text-green-700 rounded-lg border border-green-700 shadow-md"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="3"
					stroke="currentColor"
					class="w-4 h-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
					/>
				</svg>

				<p>We agree!</p>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="3"
					stroke="currentColor"
					class="w-4 h-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
					/>
				</svg>
			</div>

			<div class="mt-4">
				<DiscussionList type="comment" typeData={`positive;${discussion.$id}`} />
			</div>
		</div>
		<div class="col-span-6">
			<div
				class="p-6 text-center flex items-center justify-center space-x-2 font-medium bg-red-100 text-red-700 rounded-lg border border-red-700 shadow-md"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="3"
					stroke="currentColor"
					class="w-4 h-4 transform rotate-180"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
					/>
				</svg>

				<p>We disagree!</p>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="3"
					stroke="currentColor"
					class="w-4 h-4 transform rotate-180"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
					/>
				</svg>
			</div>

			<div class="mt-4">
				<DiscussionList type="comment" typeData={`negative;${discussion.$id}`} />
			</div>
		</div>
	</div>
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
