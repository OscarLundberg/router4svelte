<script lang="ts">
	import { routeTo } from "./router";

	export let href: string;
</script>

<a
	{href}
	{...$$restProps}
	on:click={(e) => {
		e.preventDefault();
		routeTo(href);
	}}
>
	<slot />
</a>
