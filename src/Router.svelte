<script lang="ts">
	import RouterComponent from "./RouterComponent.svelte";
	import { resolveRoute, routerState } from "./router";
	import type { NormalizedOptions, Router4SvelteConfig } from "./types";
	import { onMount } from "svelte";
	import { RouterApi } from "./router-api";
	export let config: Router4SvelteConfig;
	let currentRouteOptions: NormalizedOptions | null = null;
	let awake = false;
	onMount(() => {
		routerState.subscribe((val) => {
			currentRouteOptions = resolveRoute(val, config);
		});
		if (window.location.pathname.length > 2) {
			location.assign(`/#${window.location.pathname}`);
		} else {
			RouterApi.routeTo(window.location.hash.slice(1));
			awake = false;
		}
	});
</script>

{#if awake}
	<RouterComponent options={currentRouteOptions} />
{/if}
