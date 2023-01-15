<script lang="ts">
	import { NormalizedOptions } from "./types";
	export let options: NormalizedOptions;
</script>

<svelte:component this={options.component} {...options.props}>
	{#if options?.slot}
		<slot>
			<svelte:self options={options?.slot} />
		</slot>
	{/if}
</svelte:component>
