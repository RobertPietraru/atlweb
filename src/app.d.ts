// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/db/schema').User | null;
			session: import('$lib/server/db/schema').Session | null;
			permissions: import('$lib/server/db/schema').Permission[];
		}
	}
}

export {};
