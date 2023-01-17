<script lang="ts">
	import type { NormalizedOptions } from "./types";
	import { isset } from "./helpers";
	export let options: NormalizedOptions;
	function debug(options) {
		console.log({ slot: options?.slot });
		return true;
	}
</script>

{#if isset(options?.slot) && debug(options)}
	<svelte:component this={options.component} {...options.props}>
		<svelte:self options={options.slot} />
	</svelte:component>
{:else}
	<svelte:component this={options.component} {...options.props} />
{/if}
