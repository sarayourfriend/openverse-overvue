/// <reference types="vite/client" />

declare module "*.vue" {
	import type { DefineComponent } from "vue"
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	const component: DefineComponent<{}, {}, any>
	export default component
}

declare module "https://cdn.skypack.dev/@octokit/request@5.6.3" {
	export * from "@octokit/request"
}
