<script lang="ts">
	import RouterComponent from "./RouterComponent.svelte";
	import { resolveRoute, routerState } from "./router";
	import { NormalizedOptions, Router4SvelteConfig } from "./types";
	export let config: Router4SvelteConfig;

	let currentRouteOptions: NormalizedOptions;
	routerState.subscribe((val) => {
		currentRouteOptions = resolveRoute(val, config);
	});
</script>

<RouterComponent options={currentRouteOptions} />
