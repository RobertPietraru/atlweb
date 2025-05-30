import type { AvailableLanguageTag } from "../../lib/paraglide/runtime"
import type { ParaglideLocals } from "@inlang/paraglide-sveltekit"
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			paraglide: ParaglideLocals<AvailableLanguageTag>,

			user: import('$lib/server/db/schema').User | null;
			session: import('$lib/server/db/schema').Session | null;
			permissions: import('$lib/server/db/schema').Permission[];
		}
	}
}

export { };
