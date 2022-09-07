import { writable } from 'svelte/store';

export const accountStore = writable<null | Account>(null);