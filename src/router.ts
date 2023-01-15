import { Writable, writable } from "svelte/store";
import { isFunction, isSvelteComponent, isset } from "./helpers";
import { RouteOptions, RequestParams, NormalizedOptions, RouteConfig, Router4SvelteConfig } from "./types";

export let routerState: Writable<string> = writable("");
export let routerHistory = [];
/**
 * 
 * @param path href to link to
 */
export function routeTo(path: string) {
  history.pushState({ path }, path);

  routerState.set(path);
}

window.addEventListener('popstate', function (event) {
  event.preventDefault();
  routerState.set(event.state.path);
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


export function matchRoute(route: string, config: Router4SvelteConfig) {
  const parts = route.split("/").slice(1);
  const matchingConfigs = Object.keys(config).filter(k => {
    let routeParts = k.split("/").slice(1);
    return routeParts.every((p, i) => p.startsWith(":") || p == parts[i])
  })
  if (matchingConfigs.length > 0) {
    console.warn("Multiple config entries match this request. Last one takes precedence", ...matchingConfigs);
  }
  return matchingConfigs.at(-1) ?? null;
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
    query: queryStr.split("&").map(e => e.split("=")).reduce((p, [k, v]) => ({ ...p, [k]: v }), {}),
    params: {},
    path
  }

  let match = matchRoute(path, config);

  if (isset(match)) {
    requestParams.params = setParams(path, match);
  } else {
    if (!isset(config.DEFAULT)) { throw "Routing error - found no match and no default entry was set"; }
    match = "DEFAULT";
  }

  let resolvedConfig = config[match] ?? config.DEFAULT;
  const opts = configToOptions(resolvedConfig, requestParams);
  return normalizeOptions(opts, requestParams);
}