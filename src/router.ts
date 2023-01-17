import { Writable, writable } from "svelte/store";
import { isFunction, isSvelteComponent, isset } from "./helpers";
import type { RouteOptions, RequestParams, NormalizedOptions, RouteConfig, Router4SvelteConfig } from "./types";

export let routerState: Writable<string> = writable("");
export let routerHistory = [];

window.addEventListener('popstate', (event) => {
  event.preventDefault();
  routerState.set(event.state.path);
  history.replaceState(undefined, undefined, `#${event.state.path}`);
});

function normalizeOptions(opts: RouteOptions, requestParams: RequestParams): NormalizedOptions {
  let normalOpts: NormalizedOptions = {
    component: opts.component
  }
  if (isset(opts.slot)) {
    normalOpts.slot = normalizeOptions(configToOptions(opts.slot, requestParams), requestParams);
  }

  return normalOpts;
}

function configToOptions(conf: RouteConfig, requestParams: RequestParams): RouteOptions {
  let opts: RouteOptions;
  if (isSvelteComponent(conf)) {
    opts = {
      component: conf,
      props: { ...requestParams.params }
    }
  } else if (isFunction(conf)) {
    opts = conf(requestParams)
  } else {
    opts = conf;
  }
  return opts;
}


export function matchRoute(route: string, { DEFAULT, ...config }: Router4SvelteConfig) {
  const parts = route.split("/").slice(1);
  const matchingConfigs = Object.keys(config).filter(k => {
    let routeParts = k.split("/").slice(1);
    let matchingLength = routeParts.length == parts.length;
    return matchingLength && routeParts.every((p, i) => p.startsWith(":") || p == parts[i]);
  })
  if (matchingConfigs.length > 1) {
    console.warn("[router4svelte] Multiple config entries match this request. Last one takes precedence", matchingConfigs);
  }
  return matchingConfigs.slice(-1);
}

function setParams(current: string, match: string) {
  let parts = current.split("/").slice(1);
  return match.split("/").slice(1).reduce((prev, cur, i) => ({
    ...prev,
    ...(cur.startsWith(":") && { [cur.slice(1)]: parts[i] })
  }), {});
}

export function resolveRoute(currentState: string, config: Router4SvelteConfig): NormalizedOptions {
  const [path, queryStr = ""] = currentState.split("?");
  let requestParams: RequestParams = {
    query: queryStr.split("&").filter(e => e).map(e => e.split("=")).reduce((p, [k, v]) => ({ ...p, [k]: v }), {}),
    params: {},
    path
  }

  let [match,] = matchRoute(path, config);

  if (isset(match)) {
    requestParams.params = setParams(path, match);
    console.log({ requestParams })
  } else {
    if (!isset(config.DEFAULT)) { throw "Routing error - found no match and no default entry was set"; }
    match = "DEFAULT";
  }

  let resolvedConfig = config[match] ?? config.DEFAULT;
  const opts = configToOptions(resolvedConfig, requestParams);
  return normalizeOptions(opts, requestParams);
}