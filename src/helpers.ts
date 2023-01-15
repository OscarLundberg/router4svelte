import { SvelteComponent } from "svelte";
export function isFunction(arg: any): arg is Function {
  return typeof arg == "function";
}

export function isSvelteComponent(arg: any): arg is typeof SvelteComponent {
  return SvelteComponent.isPrototypeOf(arg);
};

export function isset<T>(arg: T | null | undefined): arg is T {
  return arg !== undefined && arg !== null;
}