import type { SvelteComponent } from "svelte";
export function isFunction(arg: any): arg is Function {
  return typeof arg == "function";
}

export function isSvelteComponent(arg: any): arg is typeof SvelteComponent {
  if (typeof arg !== 'function') return false;
  const descriptor = Object.getOwnPropertyDescriptor(arg, 'prototype');
  if (!descriptor) return false;
  return !descriptor.writable;
};

export function isset<T>(arg: T | null | undefined): arg is T {
  return arg !== undefined && arg !== null;
}