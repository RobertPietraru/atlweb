import { paraglide } from '@inlang/paraglide-sveltekit/vite'
import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [paraglide({ project: './project.inlang', outdir: './src/lib/paraglide' }),sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "pietrocka",
            project: "javascript-sveltekit"
        }
    }), sveltekit()]
});