import type { ComponentType, SvelteComponent as SC, SvelteComponentTyped } from "svelte";
type SvelteComponent = typeof SC;
import type { ComponentProps } from "svelte";

export type RequestParams = {
  path: string, // Full path
  params: Record<string, string>, // route parameters (/:id/) mapped to an object 
  query: Record<string, string> // query parameters (?id=123) mapped to an object
}

export type NormalizedOptions = {
  component: SvelteComponent;
  slot?: NormalizedOptions;
  props?: Record<string, any>;
}

export type RouteOptions = {
  /**
   * The component to render on this route
   */
  component: SvelteComponent;
  /**
   * A component to render in the default slot of the main component
   */
  slot?: RouteConfig,
  /**
   * props to pass to the component (will merge with and potentially override route params)
   */
  props?: Record<string, any>;
}

export type RouteConfig = SvelteComponent | RouteOptions | ((arg0: RequestParams) => RouteOptions);
export type Router4SvelteConfig =
  Record<string, RouteConfig> & {
    /**
     * This config will be used when no other routes match
     */
    DEFAULT?: RouteConfig
  }
