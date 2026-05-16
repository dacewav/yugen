import { writable } from 'svelte/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const currentUser = writable<any>(null);
export const authLoading = writable(true);
