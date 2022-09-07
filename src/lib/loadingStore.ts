import { writable } from 'svelte/store';

export const loadingStore = writable<boolean>(false);
