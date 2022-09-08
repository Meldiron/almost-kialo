<script lang="ts">
	import '../app.css';
	import 'sweetalert2/dist/sweetalert2.min.css';

	import type { Models } from 'appwrite';
	import { page } from '$app/stores';
	import { accountStore } from '$lib/accountStore';
	import { modalStore } from '$lib/modalStore';
	import { loadingStore } from '$lib/loadingStore';
	import { AppwriteService } from '$lib/appwrite';
	import { afterNavigate, goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { langsStore } from '$lib/langsStore';

	const pages = [
		{
			name: 'Home',
			url: '/'
		},
		{
			name: 'My Discussions',
			url: '/my-discussions'
		},
		{
			name: 'My Profile',
			url: '/my-profile'
		}
	];

	let menuOpened = false;
	let isReady = false;

	// Navigation guard logic

	onMount(async () => {
		await AppwriteService.fetchAccount();
		await AppwriteService.fetchLanguages();

		accountStore.subscribe(() => {
			if ($page.routeId) {
				guardRoute($page.routeId);
			}
		});
	});

	function guardRoute(routeId: string) {
		if (!browser) {
			return;
		}

		const isLoggedIn = $accountStore !== null;
		const hasProfile = $accountStore === null || $accountStore.prefs.profile;

		// Guest checks

		const mustBeGuest: string[] = ['login'];
		if (mustBeGuest.includes(routeId) && isLoggedIn) {
			return goto('/');
		}

		// Session checks

		const mustBeUser: string[] = ['my-discussions', 'my-profile', 'onboarding'];
		if (mustBeUser.includes(routeId) && !isLoggedIn) {
			return goto('/login');
		}

		// Profile Checks

		const mustBeProfile: string[] = ['', 'my-profile', 'my-discussions'];
		const cantBeProfile: string[] = ['onboarding'];

		if (mustBeProfile.includes(routeId) && !hasProfile) {
			return goto('/onboarding');
		}

		if (cantBeProfile.includes(routeId) && hasProfile) {
			return goto('/');
		}
	}

	afterNavigate(async (nav) => {
		if (!isReady) {
			await AppwriteService.fetchAccount();
			await AppwriteService.fetchLanguages();

			isReady = true;
		}

		if (nav.to === null || nav.to.routeId === null) {
			return;
		}

		return guardRoute(nav.to.routeId);
	});

	// New Discussion Modal logic

	let newDiscussionTitle = '';
	let newDiscussionDescription = '';
	let newDiscussionPrivate = false;
	let newDiscussionLang = 'en';
	let newDiscussionTags = '';

	async function createDiscussion() {
		const discussion = await AppwriteService.createDiscussion(
			newDiscussionTitle,
			newDiscussionDescription,
			undefined,
			newDiscussionPrivate,
			newDiscussionLang,
			false,
			newDiscussionTags.split(',')
		);

		if (discussion) {
			newDiscussionTitle = '';
			newDiscussionDescription = '';
			newDiscussionPrivate = false;
			newDiscussionLang = 'en';
			newDiscussionTags = '';

			modalStore.set(false);

			goto('/discussions/' + discussion.$id);
		}
	}
</script>

<nav class="bg-white border-slate-200 px-2 sm:px-4 py-2.5 shadow-sm">
	<div class="max-w-3xl flex flex-wrap justify-between items-center gap-y-3 mx-auto">
		<a href="/" class="flex items-center sm:mb-0">
			<img src="/logo.svg" class="mr-3 h-6 sm:h-9" alt="Almost Kialo Logo" />

			<span class="self-center text-xl font-semibold whitespace-nowrap">Almost Kialo</span>
		</a>
		<div class="flex md:order-2">
			{#if isReady}
				{#if $accountStore === null}
					<button
						on:click={AppwriteService.login}
						type="button"
						class="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
					>
						<svg
							class="mr-2 -ml-1 w-4 h-4"
							aria-hidden="true"
							focusable="false"
							data-prefix="fab"
							data-icon="github"
							role="img"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 496 512"
							><path
								fill="currentColor"
								d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
							/></svg
						>
						Sign in with Github
					</button>
				{:else if !$accountStore.prefs.profile}
					<button
						on:click={AppwriteService.logout}
						type="button"
						class="py-2.5 px-5 mr-2 text-sm font-medium text-slate-900 bg-white rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 inline-flex items-center"
					>
						Sign Out
					</button>
				{:else}
					<button
						on:click={() => modalStore.set(true)}
						type="button"
						class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0"
						>Create Discussion</button
					>
				{/if}
			{:else}
				<div class="bg-slate-200 rounded-xl w-40 animate-pulse h-10" />
			{/if}

			<button
				on:click={() => (menuOpened = !menuOpened)}
				data-collapse-toggle="navbar-cta"
				type="button"
				class="inline-flex items-center p-2 text-sm text-slate-500 rounded-lg md:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
				aria-controls="navbar-cta"
				aria-expanded="false"
			>
				<span class="sr-only">Open main menu</span>
				<svg
					class="w-6 h-6"
					aria-hidden="true"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
						clip-rule="evenodd"
					/></svg
				>
			</button>
		</div>
		<div
			class={`${
				menuOpened ? '' : 'hidden'
			} justify-between items-center w-full md:flex md:w-auto md:order-1`}
			id="navbar-cta"
		>
			<ul
				class="flex flex-col p-4 mt-4 bg-slate-50 rounded-lg border border-slate-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white"
			>
				{#each pages as p}
					<li>
						<a
							href={p.url}
							class={`block py-2 pr-4 pl-3 rounded md:p-0 ${
								$page.url.pathname === p.url
									? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700'
									: 'text-slate-700 hover:bg-slate-100 md:hover:bg-transparent md:hover:text-blue-700'
							}`}>{p.name}</a
						>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</nav>

<main class="mx-auto max-w-3xl py-4 md:py-6 px-2 sm:px-4">
	{#if isReady}
		<slot />
	{:else}
		<div role="status" class="flex justify-center">
			<svg
				class="inline mr-2 w-10 h-10 text-slate-200 animate-spin fill-blue-600"
				viewBox="0 0 100 101"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
					fill="currentColor"
				/>
				<path
					d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
					fill="currentFill"
				/>
			</svg>
			<span class="sr-only">Loading...</span>
		</div>
	{/if}
</main>

<div class=" mx-auto max-w-3xl px-2 sm:px-4">
	<footer
		class="mb-6 p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6"
	>
		<span class="text-sm text-slate-500 sm:text-center"
			>Made with ♥️ and <a href="https://appwrite.io/">
				<svg
					class="w-[24px] mt-[-5px] inline animate-bounce"
					width="30"
					height="20"
					viewBox="0 0 300 200"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M299.384 100.21C299.384 155.211 254.798 199.799 199.795 199.799C174.248 199.799 150.949 190.177 133.319 174.365C161.561 161.65 181.222 133.262 181.222 100.282C181.222 67.259 161.512 38.842 133.211 26.151C150.856 10.281 174.196 0.622009 199.795 0.622009C254.798 0.622009 299.384 45.209 299.384 100.21Z"
						fill="#F02E65"
					/>
					<path
						d="M159.987 20.718C98.825 -25.503 10.561 11.816 1.114 87.895C-3.276 123.253 11.556 158.262 40.009 179.704C101.205 225.884 189.443 188.5 198.838 112.414C203.197 77.101 188.387 42.148 159.987 20.717V20.718ZM148.91 35.393C198.809 73.046 189.233 150.593 131.674 174.979C104.964 186.297 74.242 182.504 51.085 165.028C1.189 127.374 10.763 49.827 68.321 25.442C95.032 14.126 125.754 17.918 148.91 35.393Z"
						fill="#F02E65"
					/>
					<path
						d="M102.666 65.755C102.548 66.048 101.023 72.028 99.386 79.123C97.683 86.216 94.986 97.414 93.464 104.037C90.531 116.173 88.772 124.146 88.772 125.2C88.772 125.492 90.591 125.729 92.816 125.729H96.864L98.679 117.637C99.736 113.242 102.083 103.157 103.957 95.243C105.834 87.329 108.118 77.714 108.999 73.843C109.878 69.974 110.758 66.46 110.934 66.048C111.11 65.521 110.112 65.347 107.063 65.347C104.776 65.347 102.782 65.521 102.666 65.755ZM71.183 91.138L65.79 97.002L67.375 98.878C68.252 99.932 70.659 102.571 72.709 104.742L76.462 108.725H87.133L82.089 103.274C79.332 100.346 77.046 97.529 77.046 97.179C77.046 96.768 79.157 94.132 81.739 91.316C84.317 88.446 86.428 85.98 86.428 85.688C86.428 85.452 84.201 85.277 81.505 85.277H76.638L71.183 91.138ZM112.221 85.629C112.221 85.806 113.219 86.917 114.449 88.149C119.025 92.722 122.248 96.593 122.071 97.352C121.956 97.766 119.726 100.519 117.03 103.391L112.165 108.725H117.616L123.068 108.668L128.049 103.215C130.808 100.169 133.035 97.469 133.035 97.119C133.035 96.827 130.69 94.071 127.757 90.965L122.485 85.277H117.381C114.508 85.277 112.221 85.452 112.221 85.629Z"
						fill="#F02E65"
					/>
				</svg>
			</a>
			by <a href="https://matejbaco.eu/" class="hover:underline">Matej Bačo</a>.
		</span>
		<ul class="flex flex-wrap items-center mt-3 text-sm text-slate-500 sm:mt-0">
			<li>
				<a href="/about" class="mr-4 hover:underline md:mr-6 ">About</a>
			</li>
			<li>
				<a href="/contact" class="hover:underline">Contact</a>
			</li>
		</ul>
	</footer>

	<div class="flex justify-center">
		<button
			on:click={AppwriteService.logout}
			type="button"
			class="hover:underline text-sm font-medium text-slate-500 inline-flex items-center"
		>
			Sign Out
		</button>
	</div>
</div>

{#if $loadingStore}
	<div class=" z-[100] fixed inset-0 bg-black bg-opacity-20">
		<div role="status" class="w-full h-full flex justify-center items-center">
			<svg
				class="inline mr-2 w-10 h-10 text-slate-600 animate-spin fill-slate-400"
				viewBox="0 0 100 101"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
					fill="currentColor"
				/>
				<path
					d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
					fill="currentFill"
				/>
			</svg>
			<span class="sr-only">Loading...</span>
		</div>
	</div>
{/if}

{#if $modalStore}
	<div
		tabindex="-1"
		aria-hidden="true"
		class=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full justify-center items-center bg-black bg-opacity-50"
	>
		<div class="mx-auto relative p-4 w-full max-w-md h-full md:h-auto">
			<!-- Modal content -->
			<div class="relative bg-white rounded-lg shadow">
				<button
					on:click={() => modalStore.set(false)}
					type="button"
					class="absolute top-3 right-2.5 text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
					data-modal-toggle="authentication-modal"
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
				<div class="py-6 px-6 lg:px-8">
					<h3 class="mb-4 text-xl font-medium text-slate-900">Create a New Discussion</h3>
					<form class="space-y-6" on:submit|preventDefault={createDiscussion}>
						<div>
							<label for="title" class="block mb-2 text-sm font-medium text-slate-900">Title</label>
							<input
								bind:value={newDiscussionTitle}
								type="text"
								name="title"
								id="title"
								maxlength="255"
								class="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
								placeholder="Discussion topic ..."
								required={true}
							/>
						</div>

						<div>
							<label for="description" class="block mb-2 text-sm font-medium text-slate-900 "
								>Description</label
							>
							<textarea
								bind:value={newDiscussionDescription}
								id="description"
								maxlength="1024"
								required={true}
								rows="4"
								class="block p-2.5 w-full text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 "
								placeholder="Your take on the topic ..."
							/>
						</div>

						<div>
							<label for="language" class="block mb-2 text-sm font-medium text-slate-900 "
								>Select a language</label
							>
							<select
								bind:value={newDiscussionLang}
								id="language"
								required={true}
								class="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
							>
								{#each $langsStore ?? [] as language}
									<option value={language.code}>{language.name} ({language.nativeName})</option>
								{/each}
							</select>
						</div>

						<div>
							<div class="flex">
								<div class="flex items-center h-5">
									<input
										bind:checked={newDiscussionPrivate}
										id="private-checkbox"
										aria-describedby="private-checkbox-text"
										type="checkbox"
										class="w-4 h-4 text-blue-600 bg-slate-100 rounded border-slate-300 focus:ring-blue-500 "
									/>
								</div>
								<div class="ml-2 text-sm">
									<label for="private-checkbox" class="font-medium text-slate-900 "
										>Mark as private</label
									>
									<p id="private-checkbox-text" class="text-xs font-normal text-slate-500 ">
										Private discussions will not appear on the homepage
									</p>
								</div>
							</div>
						</div>

						<div>
							<label for="tags" class="block mb-2 text-sm font-medium text-slate-900">Tags</label>
							<input
								bind:value={newDiscussionTags}
								type="text"
								name="tags"
								id="tags"
								class="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
								placeholder="comma,separated,tags"
								required={true}
								maxlength="1024"
							/>
						</div>

						<button
							type="submit"
							class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
							>Create Discussion</button
						>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}
