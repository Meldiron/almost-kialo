import type { Models } from 'appwrite';
import { writable } from 'svelte/store';

export const langsStore = writable<null | Models.Language[]>(null);
