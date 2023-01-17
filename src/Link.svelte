<script lang="ts">
	import { RouterApi } from "./router-api";

	export let href: string;
</script>

<a
	{href}
	{...$$restProps}
	on:click={(e) => {
		e.preventDefault();
		RouterApi.routeTo(href);
	}}
>
	<slot />
</a>
