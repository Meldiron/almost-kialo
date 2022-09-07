<script>
	import '../app.css';

	import { accountStore } from '$lib/accountStore';

	let menuOpened = false;
</script>

<nav class="bg-white border-slate-200 px-2 sm:px-4 py-2.5 shadow-sm">
	<div class="max-w-3xl flex flex-wrap justify-between items-center gap-y-3 mx-auto">
		<a href="https://flowbite.com/" class="flex items-center sm:mb-0">
			<span class="self-center text-xl font-semibold whitespace-nowrap">Almost Kialo</span>
		</a>
		<div class="flex md:order-2">
			{#if $accountStore === null}
				<button
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
					type="button"
					class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0"
					>Finish Onboarding</button
				>
			{:else}
				<button
					type="button"
					class="py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 inline-flex items-center"
				>
					Sign Out
				</button>
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
				<li>
					<a
						href="#"
						class="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0"
						aria-current="page">Home</a
					>
				</li>
				<li>
					<a
						href="#"
						class="block py-2 pr-4 pl-3 text-slate-700 rounded hover:bg-slate-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
						>My Discussions</a
					>
				</li>
			</ul>
		</div>
	</div>
</nav>

<main class="mx-auto max-w-3xl py-4 md:py-6 px-2 sm:px-4">
	<slot />
</main>

<footer
	class="mb-6 mx-auto max-w-3xl p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6"
>
	<span class="text-sm text-gray-500 sm:text-center"
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
	<ul class="flex flex-wrap items-center mt-3 text-sm text-gray-500 sm:mt-0">
		<li>
			<a href="/about" class="mr-4 hover:underline md:mr-6 ">About</a>
		</li>
		<li>
			<a href="/contact" class="hover:underline">Contact</a>
		</li>
	</ul>
</footer>
